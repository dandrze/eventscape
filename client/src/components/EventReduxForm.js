import React from 'react'
import { Field, reduxForm } from 'redux-form'

let EventForm = props => {
  const { handleSubmit } = props
  return <form onSubmit={handleSubmit}>
            <div>
                        <Field name="firstName" component="input" type="text" />
            </div>
            <div>
                <label htmlFor="lastName">Last Name</label>
                <Field name="lastName" component="input" type="text" />
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <Field name="email" component="input" type="email" />
            </div>
            <button type="submit">Submit</button>
        </form>
}

EventForm = reduxForm({
  // a unique name for the form
  form: 'event'
})(EventForm)

export default EventForm