import React, {
  FC,
  useCallback, useEffect,
  useMemo,
  useState,
} from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Theme,
  Backdrop,
  Button,
  CircularProgress, Collapse,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  useMediaQuery,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useValidationState, ValidateOperations } from '@client/hooks/useValidationState';
import { useQuery } from '@apollo/react-hooks';

import {
  AddTraitDataQuery as AddTraitDataQueryData,
  AddTraitDataQueryVariables,
  TraitInfoQuery,
  TraitInfoQueryVariables,
} from '@common/GQLTypes';
import AddTraitData from '@client/queries/AddTraitDataQuery.gql';
import TraitInfo from '@client/queries/TraitInfoQuery.gql';
import { InputTypeJsonObjectField } from '@client/components/InputTypeJsonObjectField';
import { TypeObjectWithKey } from '@common/GoogleActionsTypes';

interface AddTraitDialogProps {
  open: boolean;
  onClose?: () => void;
  onAdded?: () => void;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
  },
  inputType: {
    margin: theme.spacing(0, 2),
    minWidth: 180,
  },
  nestListItemText: {
    marginLeft: theme.spacing(1),
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const AddTraitDialog: FC<AddTraitDialogProps> = (props: AddTraitDialogProps) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const {
    open,
    onClose,
    onAdded,
  } = props;

  const dialogFullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [showError, setShowError] = useState(false);
  const [type, setType, typeError, hasTypeError] = useValidationState('', [
    ValidateOperations.required(),
  ], showError);

  const [
    attributesProviderType,
    setAttributesProviderType,
    attributesProviderTypeError,
    hasAttributesProviderTypeError,
  ] = useValidationState<string>('', [
    ValidateOperations.required(),
  ], showError);
  const [
    attributesProviderContent,
    setAttributesProviderContent,
    attributesProviderContentError,
    hasAttributesProviderContentError,
  ] = useValidationState({}, [
    ValidateOperations.required(),
  ], showError);
  // TODO
  useEffect(() => {
    console.log('[HomeControl]', attributesProviderContent);
  }, [attributesProviderContent]);
  const [
    statesProviderType,
    setStatesProviderType,
    statesProviderTypeError,
    hasStatesProviderTypeError,
  ] = useValidationState<string>('', [
    ValidateOperations.required(),
  ], showError);
  const [
    statesProviderContent,
    setStatesProviderContent,
    statesProviderContentError,
    hasStatesProviderContentError,
  ] = useValidationState({}, [
    ValidateOperations.required(),
  ], showError);

  const [
    commandsTypeObject,
    setCommandsTypeObject,
    commandsTypeObjectError,
    hasCommandsTypeObjectError,
  ] = useValidationState({}, [
    ValidateOperations.objectRequired(),
  ], showError);

  const {
    data: addTraitData,
    loading: addTraitDataLoading,
  } = useQuery<AddTraitDataQueryData, AddTraitDataQueryVariables>(AddTraitData);

  const {
    data: traitInfoData,
    loading: traitInfoDataLoading,
  } = useQuery<TraitInfoQuery, TraitInfoQueryVariables>(TraitInfo, {
    skip: !type,
    variables: { type },
  });

  const loading = useMemo(
    () => addTraitDataLoading || traitInfoDataLoading,
    [addTraitDataLoading, traitInfoDataLoading],
  );
  const clickAdd = useCallback(() => {
    setShowError(true);
    const typeErrors = [
      hasTypeError,
      hasAttributesProviderTypeError, hasAttributesProviderContentError,
      hasStatesProviderTypeError, hasStatesProviderContentError,
      hasCommandsTypeObjectError,
    ];
    if (typeErrors.every((e) => !e)) console.log(onAdded);
  }, [
    setShowError, onAdded,
    hasTypeError,
    hasAttributesProviderTypeError, hasAttributesProviderContentError,
    hasStatesProviderTypeError, hasStatesProviderContentError,
    hasCommandsTypeObjectError,
  ]);

  const [openLists, setOpenLists] = useState([]);
  useEffect(() => {
    setOpenLists([]);
    // setAttributesProviderType('');
    // setAttributesProviderContent('');
    // setStatesProviderType('');
    // setStatesProviderContent('');
    // setCommandsTypeObject({});
  }, [type]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={dialogFullScreen}
    >
      <Backdrop open={loading} className={classes.backdrop}>
        <CircularProgress color="secondary" size={60} thickness={5} />
      </Backdrop>

      <DialogTitle>Add Trait</DialogTitle>

      <FormControl className={classes.inputType}>
        <InputLabel required>Type</InputLabel>
        <Select
          value={type}
          required
          onChange={(e) => setType(e.target.value)}
          error={!!typeError}
        >
          {addTraitData && addTraitData.traitTypes.map((t) => (
            <MenuItem key={t.type} value={t.type}>{t.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {type && (
        <List>
          <ListItem
            button
            onClick={() => (openLists.includes('attributes')
              ? setOpenLists(openLists.filter((v) => v !== 'attributes'))
              : setOpenLists([...openLists, 'attributes']))}
          >
            <ListItemText primary="Attributes" />
            {openLists.includes('attributes') ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openLists.includes('attributes')}>
            <List component="div" disablePadding>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel required>Type</InputLabel>
                  <Select
                    value={attributesProviderType}
                    required
                    onChange={(e) => setAttributesProviderType(e.target.value as string)}
                    error={!!attributesProviderTypeError}
                  >
                    {addTraitData && addTraitData.attributesProviderTypes.map((p) => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                {(traitInfoData && attributesProviderType === 'TEXT') && (
                  <InputTypeJsonObjectField
                    typeJson={traitInfoData.traitInfo
                      .attributesJson as unknown as TypeObjectWithKey}
                    value={attributesProviderContent}
                    onChange={(e) => setAttributesProviderContent(e)}
                  />
                )}
                {/*
                <TextField
                  fullWidth
                  multiline
                  label="Content"
                  value={attributesProviderContent}
                  onChange={(e) => setAttributesProviderContent(e.target.value)}
                  error={!!attributesProviderContentError}
                  helperText={attributesProviderContentError}
                />
                */}
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => (openLists.includes('states')
              ? setOpenLists(openLists.filter((v) => v !== 'states'))
              : setOpenLists([...openLists, 'states']))}
          >
            <ListItemText primary="States" />
            {openLists.includes('states') ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openLists.includes('states')}>
            <List component="div" disablePadding>
              <ListItem>
                <FormControl fullWidth>
                  <InputLabel required>Type</InputLabel>
                  <Select
                    value={statesProviderType}
                    required
                    onChange={(e) => setStatesProviderType(e.target.value as string)}
                    error={!!statesProviderTypeError}
                  >
                    {addTraitData && addTraitData.statesProviderTypes.map((p) => (
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </ListItem>
              <ListItem>
                {(traitInfoData && statesProviderType === 'TEXT') && (
                  <InputTypeJsonObjectField
                    typeJson={traitInfoData.traitInfo
                      .statesJson as unknown as TypeObjectWithKey}
                    value={statesProviderContent}
                    onChange={(e) => setStatesProviderContent(e)}
                  />
                )}
                {/*
                <TextField
                  fullWidth
                  multiline
                  label="Content"
                  value={statesProviderContent}
                  onChange={(e) => setStatesProviderContent(e.target.value)}
                  error={!!statesProviderContentError}
                  helperText={statesProviderContentError}
                />
                */}
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => (openLists.includes('commands')
              ? setOpenLists(openLists.filter((v) => v !== 'commands'))
              : setOpenLists([...openLists, 'commands']))}
          >
            <ListItemText primary="Commands" />
            {openLists.includes('commands') ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openLists.includes('commands')}>
            <List component="div" disablePadding>
              {traitInfoData && traitInfoData.traitInfo.commands.map((commandType) => (
                <React.Fragment key={commandType}>
                  <ListItem
                    button
                    onClick={() => (openLists.includes(commandType)
                      ? setOpenLists(openLists.filter((v) => v !== commandType))
                      : setOpenLists([...openLists, commandType]))}
                  >
                    <ListItemText className={classes.nestListItemText} primary={commandType} />
                    {openLists.includes(commandType) ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openLists.includes(commandType)}>
                    <List component="div" disablePadding>
                      <ListItem>
                        <FormControl fullWidth>
                          <InputLabel required>Type</InputLabel>
                          <Select
                            value={commandsTypeObject[commandType] || ''}
                            required
                            onChange={(e) => setCommandsTypeObject({
                              ...commandsTypeObject,
                              [commandType]: e.target.value as string,
                            })}
                            error={!!commandsTypeObjectError?.[commandType]}
                          >
                            {addTraitData && addTraitData.commandsProviderTypes.map((p) => (
                              <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </ListItem>
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </List>
          </Collapse>
        </List>
      )}

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button color="secondary" onClick={clickAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};
