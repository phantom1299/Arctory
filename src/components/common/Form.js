import React from 'react';
import { Form, Label, Item, Input, Textarea, Button } from 'native-base';
import { Dimensions, Slider, View } from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { MyText as Text } from './';

const { width, height } = Dimensions.get('window');

const renderInput = ({
  input: { onChange, ...restInput },
  meta,
  label,
  placeholder,
  inputType,
  inputStyle,
  inputProps,
  labelStyle,
  itemStyle,
  itemProps,
  errorTextStyle,
  progressTextStyle,
  rightText,
  rightTextProps,
  rightProps
}) => {
  if (inputType === 'text') {
    return (
      <View>
        {/* <Text>{JSON.stringify(meta, 0, 2)}</Text> */}
        <Item
          style={
            itemStyle || {
              borderBottomWidth: 0,
              margin: 10
            }
          }
          fixedLabel
          {...itemProps}
        >
          {label && <Label style={labelStyle || { fontSize: width / 28 }}>{label}</Label>}
          <Input
            {...inputProps}
            style={
              inputStyle || {
                flex: null,
                paddingLeft: 10,
                fontSize: width / 28,
                lineHeight: width / 12,
                height: width / 12,
                width: width * 0.6,
                borderWidth: 1,
                borderColor: meta.error && meta.touched ? '#f006' : '#ccc'
              }
            }
            onChangeText={onChange}
            {...restInput}
          />
          {rightText && (
            <Button {...rightProps} transparent>
              <Text {...rightTextProps}>{rightText}</Text>
            </Button>
          )}
        </Item>
        {/* {meta.error && meta.touched && <Text style={errorTextStyle}>{meta.error}</Text>} */}
      </View>
    );
  } else if (inputType === 'textarea') {
    return (
      <Item style={itemStyle || { borderBottomWidth: 0, margin: 10 }} fixedLabel {...itemProps}>
        {label && (
          <Label
            style={
              labelStyle || {
                fontSize: width / 28,
                alignSelf: 'flex-start',
                backgroundColor: meta.error && meta.touched ? '#f00a' : 'transparent'
              }
            }
          >
            {label}
          </Label>
        )}
        <Textarea
          multiline
          numberOfLines={10}
          placeholder={placeholder}
          placeholderTextColor="#555"
          clearButtonMode="always"
          style={
            inputStyle ||
            (itemProps.floatingLabel && {
              fontSize: width / 28,
              height: height / 5,
              width: width * 0.6,
              borderWidth: 1,
              borderColor: '#ccc'
            }) || {
              fontSize: width / 28,
              height: height / 5,
              width: width * 0.6,
              borderWidth: 1,
              borderColor: '#ccc'
            }
          }
          maxLength={512}
          onChangeText={onChange}
          {...restInput}
        />
        {meta.error && meta.touched && <Text style={errorTextStyle}>{meta.error}</Text>}
      </Item>
    );
  } else if (inputType === 'slider') {
    const formatedProgress = Math.round(restInput.value * 100);
    const value = parseFloat(restInput.value) || 0;
    return (
      <Item style={itemStyle || { borderBottomWidth: 0 }}>
        <View>
          <Label style={labelStyle || { fontSize: width / 28 }}>{label}</Label>
          <Slider
            style={{ width: width / 1.1, alignSelf: 'center' }}
            step={0.05}
            onSlidingComplete={onChange}
            value={value}
            {...restInput}
          />
          <Text style={[{ textAlign: 'center' }, progressTextStyle]}>{`${formatedProgress}%`}</Text>
        </View>
      </Item>
    );
  }
};

const MyForm = (props) => {
  const {
    handleSubmit, submitting, onSubmit, formTitle, pristine, meta, buttonProps
  } = props;
  return (
    <Form style={props.formStyle}>
      {formTitle && (
        <Text
          fontSizeMultiplier={1.3}
          style={{
            padding: '5%',
            paddingLeft: '10%'
          }}
        >
          {/* {strings.addCommitTitle}
            </Text>
        <Text fontSizeMultiplier={1.3} style={{ alignSelf: 'center', margin: 10 }}> */}
          {formTitle}
        </Text>
      )}
      {props.fields &&
        props.fields.map(({ name, validators, ...rest }) => {
          return (
            <Field
              key={`${props.formTitle}: ${name}`}
              validate={validators}
              name={name}
              {...rest}
              component={renderInput}
            />
          );
        })}
      {onSubmit && (
        <Button
          {...buttonProps}
          onPress={handleSubmit(onSubmit)}
          disabled={pristine || submitting || meta}
        >
          <Text>Save</Text>
        </Button>
      )}
    </Form>
  );
};

// const FormXsaf = ({ formName, ...formOptions }) =>
//   reduxForm({
//     form: formName,
//     ...formOptions
//   })(MyForm);

const FormX = compose(
  connect((state, props) => ({ form: props.form, initialValues: props.initialValues })),
  reduxForm({})
)(MyForm);

export { FormX };
