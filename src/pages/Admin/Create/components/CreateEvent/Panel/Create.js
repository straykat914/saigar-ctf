/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import { Formik } from 'formik'

import { Icon } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'

import { SlidingPane } from '../../../../../../shared/components/SlidingPane'
import { EVENTS_QUERY, CREATE_EVENT_MUTATION } from '../../../graphql/graphQueries'
import CreateEventForm from './Form'

/*
  @TODO(Peter):
    The EditCase form and OpenCase form are essentially the same form, with very slight
    modifications.  They can (and should) be moved into a single component and wrap
    the proper mutation or queries surrounding the form.

  @TODO(Peter):
    Also change the form id to tomething more standard, and push it to the Slider.Actions
    component
*/

const CreateEvent = ({ isOpen, onRequestClose }) => (
  <SlidingPane
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    closeIcon={<Icon icon={IconNames.MENU_CLOSED} iconSize={20} />}
  >
    <SlidingPane.Header>
      <SlidingPane.Header.Title title="Add an Event" subtitle="Fill out the form and save" />
      <SlidingPane.Header.Actions onActionClick={onRequestClose}>
        <a>Cancel</a>
      </SlidingPane.Header.Actions>
    </SlidingPane.Header>

    <SlidingPane.Content>
      <Mutation mutation={CREATE_EVENT_MUTATION} refetchQueries={[{ query: EVENTS_QUERY }]}>
        {insertEvent => (
          <Formik
            initialValues={{
              event_name: '',
              start_time: '',
              end_time: '',
            }}
            onSubmit={values => {
              const { event_name: eventName, ...rest } = values
              insertEvent({
                variables: {
                  input: { name: eventName, ...rest },
                },
              })
            }}
            render={formikProps => <CreateEventForm {...formikProps} />}
          />
        )}
      </Mutation>
    </SlidingPane.Content>
    <SlidingPane.Actions form="createEventForm">SAVE</SlidingPane.Actions>
  </SlidingPane>
)

CreateEvent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
}

export default CreateEvent