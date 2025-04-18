import React from 'react'
import { Footer, FooterCopyright, FooterIcon } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { FooterTitle } from 'flowbite-react'
import { FooterLinkGroup } from 'flowbite-react'
import { FooterLink } from 'flowbite-react'
import { FooterDivider } from 'flowbite-react'
import {BsFacebook,BsTwitter,BsInstagram,BsGithub} from 'react-icons/bs'
const FooterComponent = () => {
  return (
    <Footer container className='border border-t-8 border-[#0A3150]'>
        <div className=' max-w-7xl mx-auto grid w-full '>
            <Link to='/' className='self-center whitespace-nonwrap text-lg font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-[#0A3150] rounded-lg text-white'>
                David Akintayo's 
                </span>
            Blog
            </Link>
            <div className='grid  grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-6 mt-3'>
                <div>
                    <FooterTitle title='About'/>
                    <FooterLinkGroup>
                        <FooterLink href='/about'>David Akintayo's blog</FooterLink>    
                    </FooterLinkGroup>
                </div>
                <div>
                    <FooterTitle title='Follow us'/>
                    <FooterLinkGroup col>
                        <FooterLink href='https://www.twitter.com' target='_blank'>Twitter</FooterLink>    
                        <FooterLink href='https://www.linkendin.com' target='_blank'>Linkendin</FooterLink>    
                    </FooterLinkGroup>
                </div>
                <div>
                    <FooterTitle title='Legal'/>
                    <FooterLinkGroup col>
                        <FooterLink href='#' target='_blank'>Privacy policy</FooterLink>    
                        <FooterLink href='#' target='_blank'>Terms & Conditions</FooterLink>    
                    </FooterLinkGroup>
                </div>
                <div>
                    <FooterTitle title='Developer'/>
                    <FooterLinkGroup col>
                        <FooterLink href='#' target='_blank'>Ajala Abdullah</FooterLink>    
                        <FooterLink href='https://abdullahajala.vercel.app/' target='_blank'>www.abdullahajala.vercel.app</FooterLink>    
                    </FooterLinkGroup>
                </div>
            </div>
            <FooterDivider />
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                <FooterCopyright
                    href='#'
                    by="David Akintayo's Blog"
                    year={new Date().getFullYear()}
                />
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <FooterIcon href='#' icon={BsFacebook}/>
                    <FooterIcon href='#' icon={BsTwitter}/>
                    <FooterIcon href='#' icon={BsInstagram}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}

export default FooterComponent