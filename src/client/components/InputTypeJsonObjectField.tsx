import React, { FC, useCallback, useEffect } from 'react';
import {
  FormControlLabel,
  List,
  ListItem,
  ListItemText, Switch,
  TextField,
  Typography,
} from '@material-ui/core';
import {
  makeStyles,
  createStyles,
} from '@material-ui/core/styles';
import {
  TypeObject,
  TypeObjectWithKey,
} from '@common/GoogleActionsTypes';

const makeDefaultSingleValue = (typeObject: TypeObject): any => {
  switch (typeObject.type) {
    case 'object':
      // eslint-disable-next-line no-use-before-define
      return makeDefaultValue(typeObject.prop as TypeObjectWithKey);
    case 'array':
      return [];
    default:
    case 'string':
      return '';
    case 'number':
      return 0;
    case 'boolean':
      return false;
  }
};

const makeDefaultValue = (typeJson: TypeObjectWithKey): object => Object.entries(typeJson)
  .reduce((obj, [key, typeObject]) => ({
    ...obj,
    [key]: makeDefaultSingleValue(typeObject),
  }), {});

interface InputObjectProps {
  typeObject: TypeObject;
  value: object;
  onChange: (fieldName: string, value: any) => void;
}

const InputObject: FC<InputObjectProps> = (props: InputObjectProps) => {
  const {
    typeObject,
    value,
    onChange,
  } = props;

  switch (typeObject.type) {
    case 'object':
      return (
        <>
          <Typography
            component="div"
            variant="subtitle1"
          >
            {typeObject.name}
          </Typography>
          <InputTypeJsonObjectField
            typeJson={typeObject.prop as TypeObjectWithKey}
            value={value[typeObject.name]}
            onChange={(e) => onChange(typeObject.name, e)}
          />
        </>
      );
    case 'array':
      return (
        <>
          <Typography
            component="div"
            variant="subtitle1"
          >
            {typeObject.name}
          </Typography>
          {/* TODO */}
          <List>
            <ListItem>
              <ListItemText>Text</ListItemText>
            </ListItem>
          </List>
        </>
      );
    default:
    case 'string':
      return (
        <TextField
          label={typeObject.name}
          value={value[typeObject.name]}
          onChange={(e) => onChange(typeObject.name, e.target.value)}
        />
      );
    case 'number':
      return (
        <TextField
          type="number"
          label={typeObject.name}
          value={value[typeObject.name]}
          onChange={(e) => onChange(typeObject.name, e.target.value)}
        />
      );
    case 'boolean':
      return (
        <FormControlLabel
          control={(
            <Switch
              checked={value[typeObject.name]}
              onChange={(e) => onChange(typeObject.name, e.target.checked)}
            />
          )}
          label={typeObject.name}
          labelPlacement="start"
        />
      );
  }
};

interface InputTypeJsonObjectFieldProps {
  typeJson: TypeObjectWithKey;
  value: object;
  onChange: (obj: object) => void;
  error?: boolean;
  helperText?: string;
  makeDefault?: boolean;
}

const useStyles = makeStyles(() => createStyles({
  inputJson: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const InputTypeJsonObjectField: FC<InputTypeJsonObjectFieldProps> = (
  props: InputTypeJsonObjectFieldProps,
) => {
  const classes = useStyles(props);
  const {
    typeJson,
    value: result,
    onChange: setResult,
    error,
    helperText,
    makeDefault,
  } = props;

  const onChangeFunc = useCallback((fieldName, val) => {
    const obj = {
      ...result,
      [fieldName]: val,
    };
    setResult(obj);
  }, [result, setResult]);

  useEffect(() => {
    if (makeDefault) {
      setResult(makeDefaultValue(typeJson));
    }
  }, []);

  return (
    <div className={classes.inputJson}>
      {(helperText) && (
        <Typography
          component="div"
          variant="subtitle1"
          color={error ? 'error' : undefined}
        >
          {helperText}
        </Typography>
      )}
      {(Object.entries(typeJson)).map(([key, typeObject]) => (
        <InputObject
          key={key}
          typeObject={typeObject}
          value={(result || {})[key] || {}}
          onChange={onChangeFunc}
        />
      ))}
    </div>
  );
};
