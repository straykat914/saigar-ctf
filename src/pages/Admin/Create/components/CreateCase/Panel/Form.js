import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'

// Styles
import { TextArea, FormGroup, InputGroup, NumericInput, HTMLSelect } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'

// Custom Components
import { EVENTS_QUERY } from '../../../graphql/graphQueries'

const MissingSinceInput = ({ onChange }) => {
  const handleChange = inputValue => {
    onChange('missing_since', inputValue)
  }

  return (
    <DateInput
      id="text-input"
      name="missing_since"
      onChange={handleChange}
      formatDate={date => date.toLocaleString()}
      parseDate={str => new Date(str)}
      placeholder="M/D/YYY"
      showActionsBar
      timePickerProps={{ precision: 'minute', useAmPm: true }}
      popoverProps={{
        targetProps: {
          style: { width: '100%' },
        },
      }}
      inputProps={{
        large: true,
      }}
    />
  )
}

MissingSinceInput.propTypes = {
  onChange: PropTypes.func.isRequired,
}

const DobInput = ({ onChange }) => {
  const handleChange = inputValue => {
    onChange('dob', inputValue)
  }

  return (
    <DateInput
      id="text-input"
      name="dob"
      onChange={handleChange}
      formatDate={date => date.toLocaleString()}
      parseDate={str => new Date(str)}
      placeholder="M/D/YYY"
      showActionsBar
      popoverProps={{
        targetProps: {
          style: { width: '100%' },
        },
      }}
      inputProps={{
        large: true,
      }}
    />
  )
}

DobInput.propTypes = {
  onChange: PropTypes.func.isRequired,
}

const AgeInput = ({ onChange }) => {
  const handleChange = inputValue => {
    onChange('age', inputValue)
  }

  return (
    <NumericInput
      allowNumericCharactersOnly
      buttonPosition="none"
      large
      fill
      name="age"
      onChange={handleChange}
      id="text-input"
      placeholder="14"
      onValueChange={handleChange}
      min="1"
      max="200"
    />
  )
}

AgeInput.propTypes = {
  onChange: PropTypes.func.isRequired,
}

const EventSelect = ({ values, handleChange }) => (
  <Query query={EVENTS_QUERY}>
    {({ data, loading }) => {
      if (loading) return null

      return (
        <HTMLSelect name="eventID" value={values.eventID} onChange={handleChange} fill large>
          <React.Fragment>
            <option value="" defaultValue="" hidden>
              Chose an event
            </option>
            {data.event.map(event => (
              <option key={event.uuid} value={event.uuid}>
                {event.name}
              </option>
            ))}
          </React.Fragment>
        </HTMLSelect>
      )
    }}
  </Query>
)

EventSelect.propTypes = {
  values: PropTypes.objectOf(PropTypes.object).isRequired,
  handleChange: PropTypes.func.isRequired,
}

export const CreateCaseForm = ({ handleSubmit, handleChange, values, setFieldValue }) => (
  <form id="createCaseForm" onSubmit={handleSubmit}>
    <FormGroup label="Event" labelInfo="(required)" labelFor="text-input">
      <EventSelect values={values} handleChange={handleChange} />
    </FormGroup>
    <div style={{ width: '100%', height: '1px', background: '#f6e5ef', marginBottom: 15 }} />
    <FormGroup label="Full Name" labelInfo="(required)" labelFor="text-input">
      <InputGroup
        id="text-input"
        name="name"
        value={values.name}
        onChange={handleChange}
        placeholder="e.g. - John Doe"
        large
      />
    </FormGroup>
    <FormGroup label="Date of Birth" labelFor="text-input" labelInfo="(required)">
      <DobInput onChange={setFieldValue} valueFor="dob" />
    </FormGroup>
    <FormGroup label="Missing Since" labelInfo="(required)" labelFor="text-input">
      <MissingSinceInput onChange={setFieldValue} valueFor="missing_since" />
    </FormGroup>
    <FormGroup label="Missing From" labelInfo="(required)" labelFor="text-input">
      <InputGroup
        id="text-input"
        name="missing_from"
        value={values.missing_from}
        onChange={handleChange}
        placeholder="Toronto, Ontario"
        large
      />
    </FormGroup>
    <FormGroup label="Age" labelFor="text-input">
      <AgeInput onChange={setFieldValue} />
    </FormGroup>
    <FormGroup label="Height" labelFor="text-input">
      <InputGroup
        id="text-input"
        name="height"
        value={values.height}
        onChange={handleChange}
        placeholder="5'11"
        large
      />
    </FormGroup>
    <FormGroup label="Weight" labelFor="text-input">
      <InputGroup
        id="text-input"
        name="weight"
        value={values.weight}
        onChange={handleChange}
        placeholder="86KG"
        large
      />
    </FormGroup>
    <FormGroup label="Details of Disappearance" labelFor="text-input">
      <TextArea
        id="text-input"
        name="disappearance_details"
        value={values.disappearance_details}
        onChange={handleChange}
        placeholder="(e.g. reported missing last night)"
        fill
      />
    </FormGroup>
    <FormGroup label="Distinguishing Characteristics" labelFor="text-input">
      <TextArea
        id="text-input"
        name="characteristics"
        value={values.characteristics}
        onChange={handleChange}
        placeholder="(e.g. - dragon tatto on left wrist)"
        large
        fill
      />
    </FormGroup>
    <FormGroup label="Other Notes" labelFor="text-input">
      <TextArea
        id="text-input"
        name="other_notes"
        value={values.other_notes}
        onChange={handleChange}
        placeholder="(e.g. possible case of human trafficking)"
        fill
      />
    </FormGroup>
  </form>
)

CreateCaseForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.objectOf(PropTypes.object).isRequired,
  setFieldValue: PropTypes.func.isRequired,
}

export default CreateCaseForm
