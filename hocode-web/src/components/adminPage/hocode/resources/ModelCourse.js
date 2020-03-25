/**
 * Generated ModelCourse.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React from "react";
import {
  Create,
  Datagrid,
  TextField,
  //   BooleanInput,
  SimpleForm,
  List,
  TextInput,
  Edit,
  //   BooleanField,
  EditButton,
  DeleteButton,
  ImageField,

  ChipField,
  DateField 
} from "react-admin";
//import { permitted } from '../utils';

import ModelCourseEditToolbar from "../customActions/ModelCourseEditToolbar";

import ModelCourseFilter from "../filters/ModelCourseFilter";
//import { Button } from "@material-ui/core";

import { DateTimeInput } from 'react-admin-date-inputs2';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import MomentUtils from '@date-io/moment';


export const ModelCourseList = props => (
  <List
    {...props}
    title="Danh sách Chủ đề"
    filters={<ModelCourseFilter />}
    bulkActionButtons={false}
  >
    <Datagrid>
      {/* <TextField                source="id"                sortable={false}            /> */}
      <TextField source="course_name" sortable={false} />
      {/* <TextField source="course_desc" sortable={false} /> */}
      {/* <TextField source="total_minitask" sortable={false} /> */}
      <ChipField source="user_create" />
      <ImageField
        className="thumbNailView"
        source="background_image"
        sortable={false}
      />
      {/* <BooleanField                source="del"                sortable={false}            /> */}
      {/* <                source="tasks"                sortable={false}            /> */}
      <TextField source="status" sortable={false} />
      <DateField source="start_time" />
      <DateField source="end_time" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const validateCourseCreate = (values) => {
  const errors = {};
  if (!values.course_name) {
    errors.course_name = ['The course name is required'];
  }
  if (!values.background_image) {
    errors.background_image = ['The background image is required'];
  }
  if (!values.start_time) {
    errors.start_time = ['The start time is required'];
  }
  if (!values.end_time) {
    errors.end_time = ['The end time is required'];
  }
  if (values.end_time - values.start_time <= 0) {
    errors.end_time = ['The end time must be longer than start time']
  }
  return errors
};


export const ModelCourseCreate = props => (
  <Create {...props} title="Tạo Chủ đề">
    <SimpleForm redirect="show" validate={validateCourseCreate} >
      <TextInput resettable source="course_name" />
      <TextInput resettable source="background_image" />
      <TextInput resettable multiline source="course_desc" />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimeInput
          source="start_time"
          label="Start time"
          options={{ format: 'DD/MM/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
          required
        />
        <DateTimeInput
          source="end_time"
          label="End time"
          options={{ format: 'DD/MM/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
        />
      </MuiPickersUtilsProvider>
    </SimpleForm>
  </Create>
);

// create another Create for Mod permission.
export const ModelCourseCreateForMod = props => (
  <Create {...props} title="Tạo Chủ đề">
    <SimpleForm redirect="show">
      <TextInput resettable source="course_name" />
      <TextInput resettable source="background_image" />
      <TextInput resettable multiline source="course_desc" />
      {/* <BooleanInput                source="del"            /> */}
      {/* <TextInput resettable                source="id"            /> */}
      {/* <TextInput resettable                source="tasks"            /> */}
      {/* <TextInput resettable                source="timestamp"            /> */}

      <button type="button" className="btn btn-default"
        variant="contained"
        style={{ background: "#1ECD97", color: "#fff" }}
      //  onClick={this.handleDialogCourseCheck}
      >Yêu cầu xét duyệt</button>

    </SimpleForm>
  </Create>
);

const required = (message = 'Required') =>
  value => value ? undefined : message;

const endDateValidation = (value, allValues) => {
  if (new Date(value) - new Date(allValues.start_time) <= 0 &&
    new Date(value) - new Date()) {
    return 'End date must be longer than start date and current';
  }
}

const startDateValidation = (value, allValues) => {
  if (new Date(value) - new Date() <= 0) {
    return 'End date must be longer than current';
  }
}

export const ModelCourseEdit = props => (
  <Edit {...props} title="Sửa Chủ đề">
    <SimpleForm toolbar={<ModelCourseEditToolbar />}>
      <TextInput resettable source="id" disabled />
      <TextInput resettable source="course_name" validate={[required()]} />
      <TextInput resettable source="background_image" validate={[required()]} />
      <TextInput resettable multiline source="course_desc" validate={[required()]} />
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimeInput
          source="start_time"
          label="Start time"
          options={{ format: 'DD/MM/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
          validate={[required(), startDateValidation]}
        />
        <DateTimeInput
          source="end_time"
          label="End time"
          options={{ format: 'DD/MM/YYYY, HH:mm:ss', clearable: true, ampm: false, disablePast: true }}
          validate={[required(), endDateValidation]}
        />
      </MuiPickersUtilsProvider>
    </SimpleForm>
  </Edit>
);

/** End of Generated Code **/
