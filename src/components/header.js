import React from 'react'
import Link from './link'
import {css} from '@emotion/core'
import styled from '@emotion/styled'
import theme from '../../config/theme'
import {fonts} from '../lib/typography'
import tyler from '../images/tyler.png'
import MobileNav from './mobile-nav'
import Container from './container'
import {bpMaxSM} from '../lib/breakpoints'
import {lighten} from 'polished'

function HeaderLink({headerColor, activeClassName = 'active', ...props}) {
  return (
    <Link
      activeClassName={activeClassName}
      partiallyActive={true}
      css={{
        textDecoration: 'none',
        color: theme.colors.white,
        '&:hover,&:focus': {
          textDecoration: `underline solid ${theme.colors.white}`,
          color: theme.colors.white,
        },
        '&.active': {
          background: lighten(0.4, theme.brand.primary),
          color: theme.colors.black,
        },
      }}
      {...props}
    />
  )
}

const NavLink = styled(HeaderLink)({
  padding: '8px 10px',
  borderRadius: '3px',
  background: 'transparent',
  '& + &': {marginLeft: 10},
  [bpMaxSM]: {
    display: 'none',
  },
})

function Header({
  siteTitle,
  headerLink = '/',
  headerColor = 'black',
  headerImage = true,
  maxWidth = 720,
}) {
  return (
    <header
      css={css`
        display: flex;
        align-items: center;
        width: 100%;
        background: #090a0b;
        ${bpMaxSM} {
          padding: 35px 0 0 0;
        }
        font-family: ${fonts.light};
      `}
    >
      <Container maxWidth={maxWidth} noVerticalPadding>
        <nav
          css={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <HeaderLink
            to={headerLink}
            aria-label="go to homepage"
            activeClassName="none"
            headerColor={headerColor}
            css={{
              fontFamily: fonts.regular,
              display: 'flex',
              alignItems: 'center',
              img: {
                marginBottom: 0,
                maxWidth: '50px',
                position: 'absolute',
                borderRadius: '100%',
                background:
                  headerColor === '#fff' ? 'rgba(40, 28, 77, 0.7)' : '#f1f1f1',
              },
              ':hover, :focus': {
                background: 'transparent',
              },
              span: {
                transform: headerImage && 'translateX(60px)',
              },
            }}
          >
            {headerImage && <img src={tyler} alt="Tyler Haas" />}{' '}
            <span>{siteTitle}</span>
          </HeaderLink>
          <div
            css={css`
              font-size: 16px;
              line-height: 1.25;
              display: flex;
              align-items: center;
              .mobile-nav {
                display: none;
                visibility: hidden;
                ${bpMaxSM} {
                  display: block;
                  visibility: visible;
                }
              }
            `}
          >
            <MobileNav color={headerColor} />
            <NavLink
              headerColor={headerColor}
              to="/blog/"
              aria-label="View blog page"
            >
              Blog
            </NavLink>
            {/*{' '}
            <NavLink
              headerColor={headerColor}
              to="/talks/"
              aria-label="View talks page"
            >
              Talks
            </NavLink>{' '}
            */}
            <NavLink
              headerColor={headerColor}
              to="/about/"
              aria-label="View about page"
            >
              About
            </NavLink>
          </div>
        </nav>
      </Container>
    </header>
  )
}

export default Header
