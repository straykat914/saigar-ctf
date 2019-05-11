/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { adopt } from 'react-adopt'
import CsvParse from '@vtex/react-csv-parse'

// Styles
import { Icon, Tabs, Tab, H4, HTMLSelect } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

// Custom Components
import { SlidingPanelConsumer, SlidingPane } from '../../../../../../shared/components/SlidingPane'

import './Upload.scss'

const ADD_USERS_TO_TEAM = gql`
  mutation addUserToTeam($objects: [user_team_insert_input!]!) {
    insert_user_team(objects: $objects) {
      returning {
        team_id
      }
    }
  }
`

const ADD_TEAM_TO_EVENT = gql`
  mutation addTeamToEvent($objects: [team_event_insert_input!]!) {
    insert_team_event(objects: $objects) {
      returning {
        team_id
      }
    }
  }
`

const USER_LIST = gql`
  query userList($teamId: uuid!) {
    user_team(where: { team_id: { _eq: $teamId } }) {
      user {
        uuid
        nickname
        email
      }
    }
  }
`

const addUsersToTeam = ({ render }) => (
  <Mutation mutation={ADD_USERS_TO_TEAM}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const addTeamToEvent = ({ render }) => (
  <Mutation mutation={ADD_TEAM_TO_EVENT}>
    {(mutation, result) => render({ mutation, result })}
  </Mutation>
)

const UserManager = adopt({
  addUsersToTeam,
  addTeamToEvent,
})

class FileUpload extends React.PureComponent {
  state = { fileName: null }

  handleChange = e => {
    const file = e.target.files[0].name
    this.setState({ fileName: file })
    this.props.onChange(e)
  }

  render() {
    return (
      <React.Fragment>
        <input
          type="file"
          name="file"
          id="file"
          className="inputfile"
          onChange={this.handleChange}
        />
        <label htmlFor="file">
          <Icon icon={IconNames.UPLOAD} />
          {this.state.fileName !== null ? this.state.fileName : 'Choose a file'}
        </label>
      </React.Fragment>
    )
  }
}

const TEAMS_QUERY = gql`
  query teamList($eventId: uuid!) {
    event(where: { uuid: { _eq: $eventId } }) {
      team_events {
        team {
          uuid
          name
        }
      }
    }
  }
`

const TeamSelect = ({ values, handleChange, eventId }) => (
  <Query query={TEAMS_QUERY} variables={{ eventId }}>
    {({ data, loading }) => {
      if (loading) return null

      return (
        <HTMLSelect
          name="eventID"
          value="8728c3e1-2c92-4c77-be7e-81f0e0231766"
          onChange={handleChange}
          fill
          large
        >
          <React.Fragment>
            <option value="" defaultValue="" hidden>
              Chose a team
            </option>
            {data.event[0].team_events.map(({ team }) => (
              <option key={team.uuid} value={team.uuid}>
                {team.name}
              </option>
            ))}
          </React.Fragment>
        </HTMLSelect>
      )
    }}
  </Query>
)

TeamSelect.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.any.isRequired,
  handleChange: PropTypes.func.isRequired,
}

class ManageUserTab extends React.Component {
  state = { teamId: null }

  handleSelect = e => {
    this.setState({ teamId: e.target.value })
  }

  render() {
    return (
      <div>
        <TeamSelect eventId={this.props.eventId} handleChange={this.handleSelect} />
        <Query query={USER_LIST} variables={{ teamId: this.state.teamId }}>
          {({ data, loading, error }) => {
            if (!data) return null
            if (loading) return <div>Loading...</div>
            if (error) return <div>Error...</div>

            if (!Array.isArray(data.user_team) || !data.user_team.length) {
              return <H4>No registered users</H4>
            }

            return (
              <div style={{ marginTop: 10 }}>
                {data.user_team.map(({ user }) => (
                  <div
                    key={user.uuid}
                    style={{ width: '100%', padding: 15, background: 'rgb(255, 242, 242)' }}
                  >
                    {user.nickname} | {user.email}
                  </div>
                ))}
              </div>
            )
          }}
        </Query>
      </div>
    )
  }
}

class UploadUser extends React.Component {
  state = {
    data: null,
  }

  transformUsers = () => {
    const { data } = this.state

    return data.map(user => ({
      user: {
        data: {
          nickname: `${user['Team Member First Name']}.${user['Team Member Last Name']}`,
          email: user['Team Member Email'],
          username: `${user['Team Member First Name']}.${user['Team Member Last Name']}`,
          avatar: '',
        },
      },
      team: {
        data: {
          name: user['Team Name'],
        },
      },
    }))
  }

  transformTeams = (teams, eventId) => {
    const { data } = this.state

    return teams.map(team => ({
      team_id: team.team_id,
      event_id: eventId,
    }))
  }

  render() {
    const { isOpen, onRequestClose, eventID } = this.props

    return (
      <SlidingPane
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        closeIcon={<Icon icon={IconNames.MENU_CLOSED} iconSize={20} />}
      >
        <SlidingPane.Header>
          <SlidingPane.Header.Title title="Manage Users" subtitle="View and manage users" />
          <SlidingPane.Header.Actions onActionClick={onRequestClose}>
            <a>Cancel</a>
          </SlidingPane.Header.Actions>
        </SlidingPane.Header>

        <SlidingPane.Content>
          {/* NOTE(Peter): not sure about the negative padding here, but seems ok for now, does the job */}
          <div style={{ marginTop: '-30px', width: '100%' }}>
            <Tabs large animate className="eventsTabs">
              <Tab
                id="eventsTab"
                title={<div style={{ fontSize: '1em' }}>Manage</div>}
                panel={<ManageUserTab eventId={eventID} />}
                style={{ width: '100%' }}
              />
              <Tab
                id="casesTab"
                title={<div style={{ fontSize: '1em' }}>Import</div>}
                panel={
                  <CsvParse
                    keys={[
                      'Team Name',
                      'Attendee ID',
                      'Number of Registered Members',
                      'Team Member Last Name',
                      'Team Member First Name',
                      'Ticket Type',
                      'Joined Date',
                      'Team Member Email',
                      'Currency',
                      'Team Captain Last Name',
                      'Team Captain First Name',
                      'Team Captain Email',
                      'Password',
                      'Created Date',
                      'Preferred Start Time',
                    ]}
                    onDataUploaded={data => this.setState({ data })}
                    // eslint-disable-next-line no-console
                    onError={error => console.log(error)}
                    render={onChange => <FileUpload onChange={onChange} />}
                  />
                }
              />
            </Tabs>
          </div>
        </SlidingPane.Content>

        <Mutation mutation={ADD_USERS_TO_TEAM}>
          {(insert_user_team, { data }) => (
            <Mutation mutation={ADD_TEAM_TO_EVENT}>
              {insert_team_event => {
                const addUsers = async () => {
                  const data = await insert_user_team({
                    variables: {
                      objects: this.transformUsers(),
                    },
                  })
                  const { returning } = data.data.insert_user_team

                  const teamData = this.transformTeams(returning, eventID)
                  const dataResult = await insert_team_event({
                    variables: {
                      objects: teamData,
                    },
                  })
                }

                return (
                  <SlidingPanelConsumer>
                    {({ closeSlider }) => (
                      <SlidingPane.Actions
                        form="uploadUserForm"
                        // eslint-disable-next-line no-console
                        onClick={() => addUsers().then(() => closeSlider())}
                      >
                        SAVE
                      </SlidingPane.Actions>
                    )}
                  </SlidingPanelConsumer>
                )
              }}
            </Mutation>
          )}
        </Mutation>
      </SlidingPane>
    )
  }
}

UploadUser.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/require-default-props
  //   otherProps: PropTypes.objectOf(PropTypes.object),
}

export default UploadUser