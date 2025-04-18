import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    profilePicture:{
        type: String,
        default:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAACUCAMAAAAeaLPCAAAAMFBMVEXk5ueutLeor7LV2Nrn6eq4vcCrsbXh4+Tq7O3d4OHGyszJzc/BxciyuLvR1NbY29zg2Qm9AAAEjElEQVR4nO2c2XbjIAxADRY72P//twNulpksDYtsKWd8X9L26YYKCYPwNJ2cnJycnPxnWAuTm5fMasBaap1qYJpciELeEXFx29+5A272Kvv+i5QqrNz1rQlKPJpv6Dz+wTDWhykkrV+p//jrFICrvp3Fe/OLv1hZTl4w6mW8PEZ/5Bg7S/o07JfBTws7e/8xZO6h43nZg6pV3/Qjq6zZ5J7tFR970+iep60y1NIXTGx1L/bU1j9Ah3tJmRwSvvU97tl+obeHtaY0vWQln7SmVz1XK0ctH7vlhfa06rD0u2dWUvn2DP/P0NPmy6V7tm7ImdC9f7Zex54uXcLgwJdkT5Yu7ejAC5Go5Afq0w09E9lbNT7yIhLJD0/XAlGZHSxQV2imLAysDO4QrRHGqutNXlHEDcwJwV3QrIxhwRj4skSgkPfjWX6TD8e7dz12v0JHAnmHUaIKFOtiNPl0/BYOrEjJRggKeSx3TSGPM19zujm+Sp3yp3yXPJK70BTy35wqXeUBGkf5714efPXC7KuXxBC++WHkmx8DsWYsyQN45yngIyTztQQ9gjvVptPkMNwT0dEOxkarVkQbrTB/8Rb3ZMdnLNnhQp6yw8c6ge4UfHiHXlKe4A8OPeF52jS8zZ0I1UdPRzTlGXJhpHGCZmVwBwbKbHLUDTe2+xRcM2gOtZ2LS+3p27RaG0Jv7oqDe3kqabfXbBor2/efaA4wX9KccjR9ovkLaBp7Tq3EGw3FSlN1erwnVDbQa0Gxy/SJte7ahaJvZH0FePlx8Ek296qwOfJ/0delr4lHaXqJXeO7m1JaK88pQb4AwC0xPYWPlikuju0NrxtQrmN6paWUulA+lZ+d4a9+BSazLsF7H5bVMCtJn4AHqH3q2ESNc27NzJnymX91ZmL9JcBa4+YcKzEqlVIqCWbLPPlnpWIMOYIcWH5fIKfvddmcN+PHbHn9W/kSYTWcrlXbnB7VpQp94udf4WcOxaoE+JLTYuOjVM6fKTjSLASQ02EUreYXsn/O/kRzONfS8KKWNvmX6jUdH0Bg57ermAa0TiocrA/w+bp3wxfwR96sNkHjHN1f9WV0x0xeMCGhqm/6Oh7wTgeYghqapO+Qwu/9fGhnNT5L36CT37N0Qetd71b9/ZooYPQyXQV7vdIBXNzdfXulww7utvaNEqP2An3wwf66qYGrr3A3GQDnZk6tPWobC6zHhMwNiXd5CpbDQuYK2ttA7LJbXXqPxLG3ON1YreiI8JyC1T7Zbj9+fIJ09bIHOXq6nx866JBjxz/gDs8zf6PDyCoTDs7vT/YD7XN9B/OodK+RyRLNne5TfsRbIQP2vQdwSFcTBulrUkDoV0Wgs1+Xxbj3tS/2NjDh0944CoZF0BTa+7n4DHy5qtw29uAYpMkbjd3S0PlmtV1o7enq6XnbkaaEQ7oSfqaxb5dT1IjGl+AYrBuXSDS9MgzhZU2oNMXN/tvBjbTci2FUoX6Q9ct6oHZ9oiHogVvU5GeS6rhx7ORFfcM6u/maZ2ytPHjJj+qR3/qrmFHr/tzfxoB6+ZOTE5b8AUAoRKf8t4SrAAAAAElFTkSuQmCC"
    }

},{timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;