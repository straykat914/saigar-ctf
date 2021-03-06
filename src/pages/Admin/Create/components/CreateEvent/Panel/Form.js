import React from 'react'
import PropTypes from 'prop-types'
import { FormGroup, InputGroup } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'

const TimeInput = ({ name, onChange }) => {
  const handleChange = inputValue => {
    onChange(name, inputValue)
  }

  return (
    <DateInput
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

TimeInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

const CreateEventForm = ({ handleSubmit, handleChange, setFieldValue, values }) => (
  <form id="createEventForm" onSubmit={handleSubmit}>
    <FormGroup label="Event Name" labelInfo="(required)" labelFor="text-input">
      <InputGroup
        id="text-input"
        name="event_name"
        value={values.event_name}
        onChange={handleChange}
        placeholder="e.g BSides Vancouver"
        large
      />
    </FormGroup>
    <FormGroup label="Start Time" labelInfo="(required)" labelFor="text-input">
      <TimeInput
        id="start_time"
        name="start_time"
        value={new Date(values.start_time)}
        onChange={setFieldValue}
      />
    </FormGroup>
    <FormGroup label="End Time" labelInfo="(required)" labelFor="text-input">
      <TimeInput
        id="end_time"
        name="end_time"
        value={new Date(values.end_time)}
        onChange={setFieldValue}
      />
    </FormGroup>
  </form>
)

CreateEventForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  values: PropTypes.any.isRequired,
}

export default CreateEventForm
