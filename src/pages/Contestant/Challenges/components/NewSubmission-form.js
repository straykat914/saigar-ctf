/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { isWithinRange } from 'date-fns'
import { FormGroup, HTMLSelect, TextArea } from '@blueprintjs/core'

import { SUBMISION_INFO } from '../graphql/queries'

const SUBMISSION_INFO = {
  LOCATION: {
    name: 'LOCATION',
    text: (
      <div>
        <strong>EMPLOYMENT</strong>
        <p>
          Relevant information pertaining to the current location of the subject. This can include
          but not limited to: new information on location (this does not include a Police update
          saying the person was found or an obituary - this will get you 150 points and can be under
          the category Advanced Subject Info.)
        </p>
      </div>
    ),
  },
  DARK_WEB: {
    name: 'Home',
    text: (
      <div>
        <strong>DARK WEB</strong>
        <p>
          Relevant information found on the dark web about the subject. This can include but not
          limited to:
          <ul>
            <li>pciture or details of subject on sites such as backstage</li>
            <li>discussion regarding subject on dark web sites</li>
            <li>the sales of goods by the subject on the dark web</li>
            <li>any activity or post by the subject on the dark web</li>
            <li>password breach data that includes the subject's username</li>
          </ul>
          <strong style={{ color: 'red' }}>
            Please use caution when exploring the dark web as you are likely see graphic pictures.
          </strong>
        </p>
      </div>
    ),
  },
  DAY_LAST_SEEN: {
    name: 'Day Last Seen',
    text: (
      <div>
        <strong>DAY LAST SEEN</strong>
        <p>
          Relevant information regarding the subject's last day seen. This can include but not
          limited to:
          <ul>
            <li>pictures of subject on day last seen ( e.g. CCTV)</li>
            <li>details of subject on day last seen (mood, altercations, conversations, etc)</li>
            <li>peron last seen with</li>
            <li>intent to meet with someone</li>
            <li>direction of travel</li>
            <li>other details that relate to the day last seen</li>
          </ul>
        </p>
      </div>
    ),
  },
  ADVANCED_SUBJECT_INFO: {
    name: 'Advanced Subject Info',
    text: (
      <div>
        <strong>ADVANCED SUBJECT INFO</strong>
        <p>
          Advanced relevant information regarding the subject. This can include but not limited to:
          <ul>
            <li>unique identifiers (e.g. tattoos, scars, piercings)</li>
            <li>medical issues</li>
            <li>habits (e.g. smoking, drinking, hitch hiking, hangouts)</li>
            <li>previous missing persons history</li>
            <li>brand of cell phones</li>
            <li>model of cell phones</li>
            <li>cell phone carriers</li>
            <li>make of vehicles</li>
            <li>year of vehicles</li>
            <li>color of vehicles</li>
            <li>license plate of vehicles</li>
            <li>video game handles (e.g. xbox)</li>
            <li>IP Address</li>
            <li>Any other information about where the subject might be headed</li>
          </ul>
        </p>
      </div>
    ),
  },
  BASIC_SUBJECT_INFO: {
    name: 'Basic Subject Info',
    text: (
      <div>
        <strong>BASIC SUBJECT INFO</strong>
        <p>
          Basic relevant information regarding subject. This can include but not limited to:
          <ul>
            <li>name</li>
            <li>aliases</li>
            <li>birth date</li>
            <li>pictures</li>
            <li>IDs (e.g. drivers license, passport, library card)</li>
            <li>emails</li>
            <li>social media handles/accounts</li>
            <li>blogs or forum profile and relevant posts</li>
            <li>personal websites</li>
            <li>dating site profiles and relevant posts</li>
            <li>Craigslist or Kijii profile and relevant posts</li>
            <li>
              Reddit accounts or sites of similar nature, online resume and physical description
            </li>
          </ul>
        </p>
      </div>
    ),
  },
  HOME: {
    name: 'Home',
    text: (
      <div>
        <strong>HOME</strong>
        <p>
          Information that is relevant regarding the subject's home. This can include but not
          limited to:
          <ul>
            <li>address</li>
            <li>landlord's name</li>
            <li>landlord's phone number</li>
            <li>recent accommodations</li>
            <li>any meaningful interactions with the landlord</li>
            <li>risks in the immediate area (e.g sex offenders)</li>
            <li>Habits (e.g. couch surfing)</li>
          </ul>
        </p>
      </div>
    ),
  },
  FAMILY: {
    name: 'Family',
    text: (
      <div>
        <strong>FAMILY</strong>
        <p>
          Relevant information on family. This can include but not limited to:
          <ul>
            <li>name</li>
            <li>aliases</li>
            <li>birth date</li>
            <li>IDs (e.g. drivers license, passport, library card)</li>
            <li>home address</li>
            <li>home phone number</li>
            <li>work address</li>
            <li>work phone number</li>
            <li>email</li>
            <li>social media handle</li>
            <li>any insightful information from family's comments</li>
          </ul>
        </p>
      </div>
    ),
  },
  EMPLOYMENT: {
    name: 'Employment',
    text: (
      <div>
        <strong>EMPLOYMENT</strong>
        <p>
          Relevant information on Employment. This can include but not limited to:
          <ul>
            <li>business name</li>
            <li>aliases</li>
            <li>manager name</li>
            <li>start date</li>
            <li>end date</li>
            <li>IDs (badge, license, etc)</li>
            <li>business address</li>
            <li>business phone</li>
            <li>email</li>
            <li>social media</li>
            <li>any insightful information from employer's comments</li>
          </ul>
        </p>
      </div>
    ),
  },
  FRIENDS: {
    name: 'Friends',
    text: (
      <div>
        <strong>FRIENDS</strong>
        <p>
          Relevant information on Friends. This can include but not limited to:
          <ul>
            <li>business name</li>
            <li>aliases</li>
            <li>manager name</li>
            <li>start date</li>
            <li>end date</li>
            <li>IDs (badge, license, etc)</li>
            <li>business address</li>
            <li>business phone</li>
            <li>email</li>
            <li>social media</li>
            <li>any insightful information from friends's comments</li>
          </ul>
        </p>
      </div>
    ),
  },
}

const NewSubmissionForm = ({ handleSubmit, handleChange, values }) => (
  <Query query={SUBMISION_INFO} fetchPolicy="cache-first">
    {({ error, loading, data }) => {
      if (loading) return null
      if (error) return null

      const canCreateSubmission = isWithinRange(
        new Date(data.event.start_time),
        new Date(),
        new Date(data.event.end_time),
      )

      return !canCreateSubmission ? (
        <form id="newSubmissionForm" onSubmit={handleSubmit}>
          <FormGroup label="Category" labelInfo="(required)" labelFor="text-input">
            <HTMLSelect name="category" value={values.category} onChange={handleChange} fill large>
              {data.submission_configuration.map(config => (
                <option key={config.uuid} id={config.category} value={config.uuid}>{`${
                  config.category
                } (${config.points} pts.)`}</option>
              ))}
            </HTMLSelect>
          </FormGroup>
          <FormGroup label="Proof" labelInfo="(required)" labelFor="text-input">
            <TextArea name="proof" fill value={values.proof} onChange={handleChange} />
          </FormGroup>
          <FormGroup label="Explanation" labelInfo="(required)" labelFor="text-input">
            <TextArea name="explanation" fill value={values.explanation} onChange={handleChange} />
          </FormGroup>
          <div>
            {
              SUBMISSION_INFO[
                data.submission_configuration.filter(item => item.uuid === values.category)[0]
                  .category
              ].text
            }
          </div>
        </form>
      ) : (
        <div>Competition is over</div>
      )
    }}
  </Query>
)

NewSubmissionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.object).isRequired,
}

export default React.memo(NewSubmissionForm)