import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { ButtonToolbar, Button } from 'react-bootstrap';
import * as actions from '../actions/show-forms';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import RenderSelect from './form/RenderSelect';
import RenderField from './form/RenderField';

const structuralMetadataUtils = new StructuralMetadataUtils();

let allSpans = null;

const validate = (values, props) => {
  const { smData } = props;
  const errors = {};

  if (!allSpans) {
    allSpans = structuralMetadataUtils.getItemsOfType('span', smData);
    console.log('allSpans', allSpans);
  }

  if (!values.timeSpanSelectChildOf) {
    errors.timeSpanSelectChildOf = 'Required';
  }
  if (!values.timeSpanInputTitle) {
    errors.timeSpanInputTitle = 'Required';
  }
  if (!values.timespanInputBeginTime) {
    errors.timespanInputBeginTime = 'Required';
  } else if (
    // Check for valid begin time
    !structuralMetadataUtils.validateBeginTime(
      values.timespanInputBeginTime,
      allSpans
    )
  ) {
    errors.timespanInputBeginTime = 'Invalid Begin Time';
  }
  if (!values.timespanInputEndTime) {
    errors.timespanInputEndTime = 'Required';
  } else if (
    // Check for valid end time
    !structuralMetadataUtils.validateEndTime(
      values.timespanInputEndTime,
      allSpans
    )
  ) {
    errors.timespanInputEndTime = 'Invalid End Time';
  } else if (
    !(structuralMetadataUtils.validateBeforeEndTimeOrder(
      values.timespanInputBeginTime,
      values.timespanInputEndTime
    ))
  ) {
    errors.timespanInputEndTime = 'End time must come after begin time';
  }
  return errors;
};

let TimespanForm = props => {
  const { handleSubmit, smData, submitting } = props;
  let allHeadings = structuralMetadataUtils.getItemsOfType('div', smData);
  let options = allHeadings.map(item => (
    <option value={item.label} key={item.label}>
      {item.label}
    </option>
  ));

  const handleCancelClick = () => {
    props.toggleTimespan();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Time Span</h4>
      <div className="row">
        <div className="col-sm-6">
          <Field
            name="timeSpanSelectChildOf"
            component={RenderSelect}
            className="form-control"
            options={options}
            label="Child of"
          />
          <Field
            name="timeSpanInputTitle"
            component={RenderField}
            type="text"
            label="Title"
            placeholder="Title"
          />
        </div>
        <div className="col-sm-6">
          <Field
            name="timespanInputBeginTime"
            component={RenderField}
            type="text"
            label="Begin"
            placeholder="00:00:00"
          />
          <Field
            name="timespanInputEndTime"
            component={RenderField}
            type="text"
            label="End"
            placeholder="00:00:00"
          />
        </div>
      </div>
      <ButtonToolbar>
        <Button bsStyle="primary" type="submit" disabled={submitting}>
          Add
        </Button>
        <Button onClick={handleCancelClick}>Cancel</Button>
      </ButtonToolbar>
    </form>
  );
};

const mapStateToProps = state => ({
  smData: state.smData
});

TimespanForm = reduxForm({
  form: 'timespan',
  validate
})(TimespanForm);

export default connect(
  mapStateToProps,
  actions
)(TimespanForm);