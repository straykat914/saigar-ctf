/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Layout, Flex, Fixed } from 'react-layout-pane'
import { Icon, UL } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import '../../_Design/index.scss'
import { AuthConsumer } from '../../shared/components/AuthContext/context'
import Can from '../../shared/components/AuthContext/Can'

import './index.scss'

/*
  For tomorrow, get the IO side up and running with Auth0 login, and figure out
  how best to subscribe to an intel agencies cases (subscribe to one agency and
    get all the cases would be easiest).

  Once subscribed, list all the cases and start submissions
*/

const DefaultLayout = ({ children, pathname, showFeed, feed }) => (
  <Layout type="row">
    <Fixed className="sidebar">
      {/* Note from Stephanie; putting items in a div is easier to manage than FlexGrow/Shrink */}
      <div>
        <UL>
          <li>
            <a href="#">
              <Icon icon={IconNames.MENU} iconSize={20} />
            </a>
          </li>
        </UL>
        <Can
          allowedRole={'ctf_admin' || 'judge'}
          yes={() => (
            <UL>
              <li className={pathname === '/home' ? 'active' : ''}>
                <Link to="home">
                  <Icon icon={IconNames.HOME} iconSize={20} />
                </Link>
              </li>
            </UL>
          )}
        />
        <Can
          allowedRole="contestant"
          yes={() => (
            <UL>
              <li className={pathname === '/challenges' ? 'active' : ''}>
                <Link to="challenges">
                  <Icon icon={IconNames.FOLDER_OPEN} iconSize={20} />
                </Link>
              </li>
            </UL>
          )}
        />
        <Can
          allowedRole="ctf_admin"
          yes={() => (
            <UL>
              <li className={pathname === '/create' ? 'active' : ''}>
                <Link to="create">
                  <Icon icon={IconNames.ADD} iconSize={20} />
                </Link>
              </li>
            </UL>
          )}
        />
        <UL>
          <li>
            <Link to="scoreboard">
              <Icon icon={IconNames.TIMELINE_LINE_CHART} iconSize={20} />
            </Link>
          </li>
        </UL>
      </div>
      <div>
        {/* <UL>
          <li>
            <a href="#">
              <Icon icon={IconNames.CHAT} iconSize={20} />
            </a>
          </li>
        </UL> */}
        <UL>
          <AuthConsumer>
            {({ logout }) => (
              <li>
                <a onClick={logout}>
                  <Icon icon={IconNames.LOG_OUT} iconSize={20} />
                </a>
              </li>
            )}
          </AuthConsumer>
        </UL>
        {/* <UL>
          <li>
            <a href="#">
              <Icon icon={IconNames.SETTINGS} iconSize={20} />
            </a>
          </li>
        </UL> */}
      </div>
    </Fixed>
    <Flex>
      <Layout type="column">
        <Flex
          className="content"
          style={{
            background: '#F5F8FA',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {children}
        </Flex>
        <Fixed className="footer">
          Powered by <a href="https://saigar.io">saigar.io</a> |{' '}
          <Link to="/terms-of-service" style={{ color: '#bfbfbf' }}>
            Terms of Service
          </Link>
        </Fixed>
      </Layout>
    </Flex>
    {showFeed && (
      <Fixed
        className="rightSideBar"
        style={{
          width: 375,
        }}
      >
        <Layout type="column">
          <Flex>{feed}</Flex>
        </Layout>
      </Fixed>
    )}
    {/* <div
      style={{
        position: 'absolute',
        width: '300px',
        left: '78px',
        background: '#F5F8FA',
        top: 0,
        height: '100%',
        padding: 20,
        zIndex: 9999,
        borderRight: '1px solid #e6dddd',
        boxShadow: '-10px 0px 10px 1px rgba(0, 0, 0,0.08)',
      }}
    >
      <div style={{ float: 'right' }}>
        <Icon icon={IconNames.CROSS} iconSize={32} />
      </div>
      <div className="teamList">hi</div>
    </div> */}
  </Layout>
)

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
  pathname: PropTypes.string.isRequired,
  showFeed: PropTypes.bool,
  feed: PropTypes.element,
}

DefaultLayout.defaultProps = {
  showFeed: false,
  feed: null,
}

export default DefaultLayout
