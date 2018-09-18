import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import StructuralMetadataUtils from '../services/StructuralMetadataUtils';
import RenderField from './form/RenderField';
import RenderSelect from './form/RenderSelect';
import { ButtonToolbar, Button } from 'react-bootstrap';
import * as actions from '../actions/show-forms';

const structuralMetadataUtils = new StructuralMetadataUtils();

const validate = values => {
  const errors = {};
  if (!values.headingSelectChildOf) {
    errors.headingSelectChildOf = 'Required';
  }
  if (!values.headingInputTitle) {
    errors.headingInputTitle = 'Required';
  }
  return errors;
};


let HeadingForm = props => {
  const { handleSubmit, submitting, smData } = props;
  let allHeaders = structuralMetadataUtils.getItemsOfType('div', smData);
  let options = allHeaders.map(header => (
    <option value={header.label} key={header.label}>
      {header.label}
    </option>
  ));

  const handleCancelClick = () => {
    props.toggleHeading();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Add New Heading</h4>
      <Field
        label="Child of"
        name="headingSelectChildOf"
        component={RenderSelect}
        options={options}
      />
      <Field
        label="Title"
        name="headingInputTitle"
        component={RenderField}
        type="text"
      />
      <ButtonToolbar>
        <Button bsStyle="primary" type="submit" disabled={submitting}>Add</Button>
        <Button onClick={handleCancelClick}>Cancel</Button>
      </ButtonToolbar>
    </form>
  );
};

const mapStateToProps = state => ({
  smData: state.smData
});

HeadingForm = reduxForm({
  form: 'heading',
  validate // validation function given to redux-form
})(HeadingForm);

export default connect(mapStateToProps, actions)(HeadingForm);