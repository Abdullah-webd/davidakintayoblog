import Post from "../model/Post.model.js";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to create a post'));
    }

    if (!req.body || !req.body.title || !req.body.content) {
        return next(errorHandler(400, 'All fields are required'));
    }

    const slug = req.body.title
        .trim()
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '-') // Replace invalid characters
        .replace(/--+/g, '-'); // Replace multiple dashes with one

    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getpost = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            })

        }).sort({ createdAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments()
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const postsInLastMonth = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({
            posts,
            totalPosts,
            postsInLastMonth
        });


    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Post deleted successfully');
    } catch (error) {
        next(error);
    }
}

export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not authorized to update this post'));
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set: req.body,
        }, { new: true });
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
}

export const commentPost = async (req, res, next) => {
    if (!req.body || !req.body.comment || !req.body.username || !req.body.profilePicture) {
        return next(errorHandler(400, 'All fields are required'));
    }

    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }

        post.comments.push({
            userId: req.user.id,
            username: req.body.username,
            profilePicture: req.body.profilePicture,
            comment: req.body.comment,
            createdAt: new Date(),
        });

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
}

export const getComments = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }

        res.status(200).json(post.comments);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return next(errorHandler(404, 'Post not found'));
      }
  
      post.comments = post.comments.filter(
        (comment) => comment.createdAt.toISOString() !== req.query.createdAt
      );
  
      const updatedPost = await post.save();
      res.status(200).json(updatedPost.comments);
    } catch (error) {
      next(error);
    }
  };
  

// Like/Unlike Post Controller
export const likePost = async (req, res, next) => {
    try {
      const post = await Post.findById(req.params.postId);
      if (!post) {
        return next(errorHandler(404, 'Post not found'));
      }
  
      const userId = req.user.id; // make sure your auth middleware adds req.user
  
      if (post.likes.includes(userId)) {
        // Already liked — unlike it
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        // Not liked yet — like it
        post.likes.push(userId);
      }
  
      const updatedPost = await post.save();
      res.status(200).json({
        success: true,
        likesCount: updatedPost.likes.length,
        likedByUser: updatedPost.likes.includes(userId)
      });
    } catch (error) {
      next(error);
    }
  };

export const getLike = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        res.status(200).json(post.likes.length);
    } catch (error) {
        next(error);
    }
}

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
    const [totalUsers, totalPosts, totalComments, totalLikes] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.aggregate([{ $unwind: "$comments" }, { $count: "count" }]).then(r => r[0]?.count || 0),
      Post.aggregate([{ $unwind: "$likes" }, { $count: "count" }]).then(r => r[0]?.count || 0),
    ]);
  
    // Example: Comments in last 30 days
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const posts = await Post.find({ createdAt: { $gte: last30Days } });
  
    let commentsChart = Array.from({ length: 30 }, (_, i) => {
      let date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      return { date: date.toISOString().split('T')[0], count: 0 };
    }).reverse();
  
    posts.forEach(post => {
      post.comments.forEach(comment => {
        let date = new Date(comment.createdAt).toISOString().split('T')[0];
        let entry = commentsChart.find(d => d.date === date);
        if (entry) entry.count++;
      });
    });
  
    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalLikes,
      commentsLast30Days: commentsChart.reduce((acc, d) => acc + d.count, 0),
      commentsChart,
    });
  };

  export const getPopularPosts = async (req, res, next) => {
    try {
      // 🔍 Find all posts, sort them by 'likes' in descending order (-1), then limit to top 5
      const posts = await Post.find().sort({ likes: -1 }).limit(2);
  
      res.status(200).json(posts);
    } catch (error) {
      // 🔥 Pass any error to the error handler middleware
      next(error);
    }
  };
  

export const getRelatedPosts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found'));
        }
        const relatedPosts = await Post.find({
            _id: { $ne: post._id },
            category: post.category,
        }).limit(5);
        res.status(200).json(relatedPosts);
    } catch (error) {
        next(error);
    }
}
  
  
