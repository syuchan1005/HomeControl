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
import { useMutation, useQuery } from '@apollo/react-hooks';

import {
  AddTraitDataQuery as AddTraitDataQueryData,
  AddTraitDataQueryVariables,
  TraitInfoQuery,
  TraitInfoQueryVariables,
  AddTraitMutation,
  AddTraitMutationVariables, CommandInput,
} from '@common/GQLTypes';
import AddTraitData from '@client/queries/AddTraitDataQuery.gql';
import TraitInfo from '@client/queries/TraitInfoQuery.gql';
import AddTrait from '@client/queries/AddTraitMutation.gql';
import { InputTypeJsonObjectField } from '@client/components/InputTypeJsonObjectField';
import { TypeObjectWithKey } from '@common/GoogleActionsTypes';

interface AddTraitDialogProps {
  openDeviceId?: number;
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
  listItemError: {
    backgroundColor: theme.palette.error.main,
    width: theme.spacing(1),
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
}));

// eslint-disable-next-line import/prefer-default-export
export const AddTraitDialog: FC<AddTraitDialogProps> = (props: AddTraitDialogProps) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const {
    openDeviceId,
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
  const attributeError = useMemo(
    () => !!attributesProviderTypeError || !!attributesProviderContentError,
    [attributesProviderTypeError, attributesProviderContentError],
  );
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
  const stateError = useMemo(
    () => !!statesProviderTypeError || !!statesProviderContentError,
    [statesProviderTypeError, statesProviderContentError],
  );
  const [
    commandsTypeObject,
    setCommandsTypeObject,
    commandsTypeObjectError,
    hasCommandsTypeObjectError,
  ] = useValidationState<{ [key: string]: string}>({}, [
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
    onCompleted(data) {
      if (data && data.traitInfo) {
        setCommandsTypeObject(data.traitInfo.commands.reduce((obj, k) => ({
          ...obj,
          [k]: undefined,
        }), {}));
      }
    },
  });

  const [doAddTrait, { loading: addTraitLoading }] = useMutation<AddTraitMutation,
    AddTraitMutationVariables>(AddTrait, {
      onCompleted(data) {
        if (data && data.addTrait) {
          if (onAdded) onAdded();
        }
      },
    });

  const loading = useMemo(
    () => addTraitDataLoading || traitInfoDataLoading || addTraitLoading,
    [addTraitDataLoading, traitInfoDataLoading, addTraitLoading],
  );
  const clickAdd = useCallback(() => {
    setShowError(true);
    const typeErrors = Object.entries({
      hasTypeError,
      hasAttributesProviderTypeError,
      hasAttributesProviderContentError,
      hasStatesProviderTypeError,
      hasStatesProviderContentError,
      hasCommandsTypeObjectError,
    }).reduce((obj, [k, v]) => ({
      ...obj,
      [k]: !v,
    }), {});
    if (Object.values(typeErrors).every((e) => e)) {
      doAddTrait({
        variables: {
          trait: {
            deviceId: openDeviceId,
            type,
            attributesProvider: {
              type: attributesProviderType,
              content: attributesProviderContent,
            },
            statesProvider: {
              type: statesProviderType,
              content: statesProviderContent,
            },
            commandsProviders: Object.entries(commandsTypeObject)
              .map(([commandType, providerType]) => ({
                type: commandType,
                provider: {
                  type: providerType,
                },
              }) as CommandInput),
          },
        },
      });
    }
  }, [
    setShowError,
    hasTypeError,
    hasAttributesProviderTypeError,
    hasAttributesProviderContentError,
    hasStatesProviderTypeError,
    hasStatesProviderContentError,
    hasCommandsTypeObjectError,
    onAdded,
    openDeviceId,
    type,
    attributesProviderType,
    attributesProviderContent,
    statesProviderType,
    statesProviderContent,
    commandsTypeObject,
  ]);

  const [openLists, setOpenLists] = useState([]);
  useEffect(() => {
    setOpenLists([]);
    setAttributesProviderType('');
    setAttributesProviderContent('');
    setStatesProviderType('');
    setStatesProviderContent('');
    setCommandsTypeObject({});
  }, [type]);

  return (
    <Dialog
      open={openDeviceId !== undefined}
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
            {attributeError && (<div className={classes.listItemError} />)}
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
                    makeDefault
                    typeJson={traitInfoData.traitInfo
                      .attributesJson as unknown as TypeObjectWithKey}
                    value={attributesProviderContent}
                    onChange={(e) => setAttributesProviderContent(e)}
                    error={!!attributesProviderContentError}
                  />
                )}
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => (openLists.includes('states')
              ? setOpenLists(openLists.filter((v) => v !== 'states'))
              : setOpenLists([...openLists, 'states']))}
          >
            {stateError && (<div className={classes.listItemError} />)}
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
                    makeDefault
                    typeJson={traitInfoData.traitInfo
                      .statesJson as unknown as TypeObjectWithKey}
                    value={statesProviderContent}
                    onChange={(e) => setStatesProviderContent(e)}
                    error={!!statesProviderContentError}
                  />
                )}
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            onClick={() => (openLists.includes('commands')
              ? setOpenLists(openLists.filter((v) => v !== 'commands'))
              : setOpenLists([...openLists, 'commands']))}
          >
            {(showError && hasCommandsTypeObjectError) && (
              <div className={classes.listItemError} />
            )}
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
