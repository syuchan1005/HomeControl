import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Upload: Promise<{ filename: string, mimetype: string, encoding: string, createReadStream: () => NodeJS.ReadableStream }>;
  DateTime: string;
  TrueOnly: true;
  DeviceType: string;
  TraitType: string;
  ProviderType: string;
};







export type Query = {
  __typename?: 'Query';
  sensors: Array<Sensor>;
  sensorData: Array<SensorData>;
  remoteControllers: Array<RemoteController>;
  remoteController: RemoteController;
  widgets: Array<Widget>;
  deviceTypes: Array<DeviceTypeData>;
  devices: Array<Device>;
};


export type QuerySensorDataArgs = {
  sensorName: Scalars['String'];
  dataType: Scalars['String'];
};


export type QueryRemoteControllerArgs = {
  id: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  signUp: Scalars['TrueOnly'];
  login: AuthToken;
  addSensorData: Scalars['Boolean'];
  registerIrServer: Scalars['String'];
  addRemoteController: RemoteController;
  addRemoteControllerButton: RemoteControllerButton;
  sendRemoteControllerButton: Scalars['TrueOnly'];
  addSensorWidget: SensorWidget;
  addRemoteControllerWidget: RemoteControllerWidget;
  addDevice: Device;
};


export type MutationSignUpArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  clientId?: Maybe<Scalars['String']>;
};


export type MutationAddSensorDataArgs = {
  name: Scalars['String'];
  dataType: Scalars['String'];
  value: Scalars['Float'];
  createdAt?: Maybe<Scalars['DateTime']>;
};


export type MutationRegisterIrServerArgs = {
  ip: Scalars['String'];
};


export type MutationAddRemoteControllerArgs = {
  name: Scalars['String'];
};


export type MutationAddRemoteControllerButtonArgs = {
  controllerId?: Maybe<Scalars['Int']>;
  name: Scalars['String'];
};


export type MutationSendRemoteControllerButtonArgs = {
  buttonId?: Maybe<Scalars['Int']>;
};


export type MutationAddSensorWidgetArgs = {
  name: Scalars['String'];
  dataType: Scalars['String'];
};


export type MutationAddRemoteControllerWidgetArgs = {
  controllerId: Scalars['Int'];
};


export type MutationAddDeviceArgs = {
  device: InputDevice;
};

export type Subscription = {
  __typename?: 'Subscription';
  sensorData: SensorData;
};


export type SubscriptionSensorDataArgs = {
  sensorName: Scalars['String'];
  dataType: Scalars['String'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  expiredAt: Scalars['DateTime'];
};

export type Sensor = {
  __typename?: 'Sensor';
  name: Scalars['String'];
  dataType: Array<Scalars['String']>;
};

export type SensorData = {
  __typename?: 'SensorData';
  value: Scalars['Float'];
  createdAt: Scalars['DateTime'];
};

export type RemoteController = {
  __typename?: 'RemoteController';
  id: Scalars['Int'];
  name: Scalars['String'];
  buttons: Array<RemoteControllerButton>;
};

export type RemoteControllerButton = {
  __typename?: 'RemoteControllerButton';
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Widget = {
  id: Scalars['Int'];
};

export type SensorWidget = Widget & {
  __typename?: 'SensorWidget';
  id: Scalars['Int'];
  name: Scalars['String'];
  dataType: Scalars['String'];
};

export type RemoteControllerWidget = Widget & {
  __typename?: 'RemoteControllerWidget';
  id: Scalars['Int'];
  controllerId: Scalars['Int'];
};

export type Device = {
  __typename?: 'Device';
  id: Scalars['Int'];
  type: DeviceTypeData;
  name: Scalars['String'];
  willReportState: Scalars['Boolean'];
  roomHint?: Maybe<Scalars['String']>;
  traits: Array<Trait>;
};

export type Trait = {
  __typename?: 'Trait';
  id: Scalars['Int'];
  type: Scalars['TraitType'];
  attributesProvider: Provider;
  statesProvider: Provider;
  commandsProvider: Provider;
};

export type Provider = {
  __typename?: 'Provider';
  traitId: Scalars['Int'];
  type: Scalars['ProviderType'];
  content: Scalars['String'];
};

export type InputDevice = {
  type: Scalars['DeviceType'];
  name: Scalars['String'];
  willReportState: Scalars['Boolean'];
  roomHint?: Maybe<Scalars['String']>;
};

export type DeviceTypeData = {
  __typename?: 'DeviceTypeData';
  type: Scalars['DeviceType'];
  name: Scalars['String'];
};

export type AddDeviceMutationVariables = {
  device: InputDevice;
};


export type AddDeviceMutation = (
  { __typename?: 'Mutation' }
  & { addDevice: (
    { __typename?: 'Device' }
    & Pick<Device, 'id' | 'name'>
  ) }
);

export type AddRemoteControllerButtonMutationVariables = {
  id: Scalars['Int'];
  name: Scalars['String'];
};


export type AddRemoteControllerButtonMutation = (
  { __typename?: 'Mutation' }
  & { addRemoteControllerButton: (
    { __typename?: 'RemoteControllerButton' }
    & Pick<RemoteControllerButton, 'id' | 'name'>
  ) }
);

export type AddRemoteControllerMutationVariables = {
  name: Scalars['String'];
};


export type AddRemoteControllerMutation = (
  { __typename?: 'Mutation' }
  & { addRemoteController: (
    { __typename?: 'RemoteController' }
    & Pick<RemoteController, 'id' | 'name'>
    & { buttons: Array<(
      { __typename?: 'RemoteControllerButton' }
      & Pick<RemoteControllerButton, 'id' | 'name'>
    )> }
  ) }
);

export type AddRemoteControllerWidgetMutationVariables = {
  id: Scalars['Int'];
};


export type AddRemoteControllerWidgetMutation = (
  { __typename?: 'Mutation' }
  & { addRemoteControllerWidget: (
    { __typename?: 'RemoteControllerWidget' }
    & Pick<RemoteControllerWidget, 'id' | 'controllerId'>
  ) }
);

export type AddSensorWidgetMutationVariables = {
  name: Scalars['String'];
  dataType: Scalars['String'];
};


export type AddSensorWidgetMutation = (
  { __typename?: 'Mutation' }
  & { addSensorWidget: (
    { __typename?: 'SensorWidget' }
    & Pick<SensorWidget, 'id' | 'name' | 'dataType'>
  ) }
);

export type DeviceTypesQueryVariables = {};


export type DeviceTypesQuery = (
  { __typename?: 'Query' }
  & { deviceTypes: Array<(
    { __typename?: 'DeviceTypeData' }
    & Pick<DeviceTypeData, 'type' | 'name'>
  )> }
);

export type DevicesQueryVariables = {};


export type DevicesQuery = (
  { __typename?: 'Query' }
  & { devices: Array<(
    { __typename?: 'Device' }
    & Pick<Device, 'id' | 'name' | 'roomHint' | 'willReportState'>
    & { type: (
      { __typename?: 'DeviceTypeData' }
      & Pick<DeviceTypeData, 'type' | 'name'>
    ) }
  )> }
);

export type LoginMutationVariables = {
  username: Scalars['String'];
  password: Scalars['String'];
  clientId?: Maybe<Scalars['String']>;
};


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'AuthToken' }
    & Pick<AuthToken, 'accessToken' | 'refreshToken' | 'expiredAt'>
  ) }
);

export type RemoteControllerQueryVariables = {
  id: Scalars['Int'];
};


export type RemoteControllerQuery = (
  { __typename?: 'Query' }
  & { remoteController: (
    { __typename?: 'RemoteController' }
    & Pick<RemoteController, 'id' | 'name'>
    & { buttons: Array<(
      { __typename?: 'RemoteControllerButton' }
      & Pick<RemoteControllerButton, 'id' | 'name'>
    )> }
  ) }
);

export type RemoteControllerNamesQueryVariables = {};


export type RemoteControllerNamesQuery = (
  { __typename?: 'Query' }
  & { remoteControllers: Array<(
    { __typename?: 'RemoteController' }
    & Pick<RemoteController, 'id' | 'name'>
  )> }
);

export type RemoteControllersQueryVariables = {};


export type RemoteControllersQuery = (
  { __typename?: 'Query' }
  & { remoteControllers: Array<(
    { __typename?: 'RemoteController' }
    & Pick<RemoteController, 'id' | 'name'>
    & { buttons: Array<(
      { __typename?: 'RemoteControllerButton' }
      & Pick<RemoteControllerButton, 'id' | 'name'>
    )> }
  )> }
);

export type SendRemoteControllerButtonMutationVariables = {
  id: Scalars['Int'];
};


export type SendRemoteControllerButtonMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendRemoteControllerButton'>
);

export type SensorDataQueryVariables = {
  sensorName: Scalars['String'];
  dataType: Scalars['String'];
};


export type SensorDataQuery = (
  { __typename?: 'Query' }
  & { sensorData: Array<(
    { __typename?: 'SensorData' }
    & Pick<SensorData, 'value' | 'createdAt'>
  )> }
);

export type SensorDataSubscriptionSubscriptionVariables = {
  sensorName: Scalars['String'];
  dataType: Scalars['String'];
};


export type SensorDataSubscriptionSubscription = (
  { __typename?: 'Subscription' }
  & { sensorData: (
    { __typename?: 'SensorData' }
    & Pick<SensorData, 'value' | 'createdAt'>
  ) }
);

export type SensorsQueryVariables = {};


export type SensorsQuery = (
  { __typename?: 'Query' }
  & { sensors: Array<(
    { __typename?: 'Sensor' }
    & Pick<Sensor, 'name' | 'dataType'>
  )> }
);

export type SignUpMutationVariables = {
  username: Scalars['String'];
  password: Scalars['String'];
};


export type SignUpMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'signUp'>
);

export type WidgetsQueryVariables = {};


export type WidgetsQuery = (
  { __typename?: 'Query' }
  & { widgets: Array<(
    { __typename: 'SensorWidget' }
    & Pick<SensorWidget, 'name' | 'dataType' | 'id'>
  ) | (
    { __typename: 'RemoteControllerWidget' }
    & Pick<RemoteControllerWidget, 'controllerId' | 'id'>
  )> }
);



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}> = (obj: T, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  String: ResolverTypeWrapper<Scalars['String']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  TrueOnly: ResolverTypeWrapper<Scalars['TrueOnly']>;
  DeviceType: ResolverTypeWrapper<Scalars['DeviceType']>;
  TraitType: ResolverTypeWrapper<Scalars['TraitType']>;
  ProviderType: ResolverTypeWrapper<Scalars['ProviderType']>;
  Query: ResolverTypeWrapper<{}>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  Subscription: ResolverTypeWrapper<{}>;
  AuthToken: ResolverTypeWrapper<AuthToken>;
  Sensor: ResolverTypeWrapper<Sensor>;
  SensorData: ResolverTypeWrapper<SensorData>;
  RemoteController: ResolverTypeWrapper<RemoteController>;
  RemoteControllerButton: ResolverTypeWrapper<RemoteControllerButton>;
  Widget: ResolversTypes['SensorWidget'] | ResolversTypes['RemoteControllerWidget'];
  SensorWidget: ResolverTypeWrapper<SensorWidget>;
  RemoteControllerWidget: ResolverTypeWrapper<RemoteControllerWidget>;
  Device: ResolverTypeWrapper<Device>;
  Trait: ResolverTypeWrapper<Trait>;
  Provider: ResolverTypeWrapper<Provider>;
  InputDevice: InputDevice;
  DeviceTypeData: ResolverTypeWrapper<DeviceTypeData>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  String: Scalars['String'];
  Boolean: Scalars['Boolean'];
  Upload: Scalars['Upload'];
  DateTime: Scalars['DateTime'];
  TrueOnly: Scalars['TrueOnly'];
  DeviceType: Scalars['DeviceType'];
  TraitType: Scalars['TraitType'];
  ProviderType: Scalars['ProviderType'];
  Query: {};
  Int: Scalars['Int'];
  Mutation: {};
  Float: Scalars['Float'];
  Subscription: {};
  AuthToken: AuthToken;
  Sensor: Sensor;
  SensorData: SensorData;
  RemoteController: RemoteController;
  RemoteControllerButton: RemoteControllerButton;
  Widget: ResolversParentTypes['SensorWidget'] | ResolversParentTypes['RemoteControllerWidget'];
  SensorWidget: SensorWidget;
  RemoteControllerWidget: RemoteControllerWidget;
  Device: Device;
  Trait: Trait;
  Provider: Provider;
  InputDevice: InputDevice;
  DeviceTypeData: DeviceTypeData;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export interface TrueOnlyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TrueOnly'], any> {
  name: 'TrueOnly';
}

export interface DeviceTypeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DeviceType'], any> {
  name: 'DeviceType';
}

export interface TraitTypeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['TraitType'], any> {
  name: 'TraitType';
}

export interface ProviderTypeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['ProviderType'], any> {
  name: 'ProviderType';
}

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  sensors?: Resolver<Array<ResolversTypes['Sensor']>, ParentType, ContextType>;
  sensorData?: Resolver<Array<ResolversTypes['SensorData']>, ParentType, ContextType, RequireFields<QuerySensorDataArgs, 'sensorName' | 'dataType'>>;
  remoteControllers?: Resolver<Array<ResolversTypes['RemoteController']>, ParentType, ContextType>;
  remoteController?: Resolver<ResolversTypes['RemoteController'], ParentType, ContextType, RequireFields<QueryRemoteControllerArgs, 'id'>>;
  widgets?: Resolver<Array<ResolversTypes['Widget']>, ParentType, ContextType>;
  deviceTypes?: Resolver<Array<ResolversTypes['DeviceTypeData']>, ParentType, ContextType>;
  devices?: Resolver<Array<ResolversTypes['Device']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  signUp?: Resolver<ResolversTypes['TrueOnly'], ParentType, ContextType, RequireFields<MutationSignUpArgs, 'username' | 'password'>>;
  login?: Resolver<ResolversTypes['AuthToken'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'username' | 'password'>>;
  addSensorData?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationAddSensorDataArgs, 'name' | 'dataType' | 'value'>>;
  registerIrServer?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<MutationRegisterIrServerArgs, 'ip'>>;
  addRemoteController?: Resolver<ResolversTypes['RemoteController'], ParentType, ContextType, RequireFields<MutationAddRemoteControllerArgs, 'name'>>;
  addRemoteControllerButton?: Resolver<ResolversTypes['RemoteControllerButton'], ParentType, ContextType, RequireFields<MutationAddRemoteControllerButtonArgs, 'name'>>;
  sendRemoteControllerButton?: Resolver<ResolversTypes['TrueOnly'], ParentType, ContextType, RequireFields<MutationSendRemoteControllerButtonArgs, never>>;
  addSensorWidget?: Resolver<ResolversTypes['SensorWidget'], ParentType, ContextType, RequireFields<MutationAddSensorWidgetArgs, 'name' | 'dataType'>>;
  addRemoteControllerWidget?: Resolver<ResolversTypes['RemoteControllerWidget'], ParentType, ContextType, RequireFields<MutationAddRemoteControllerWidgetArgs, 'controllerId'>>;
  addDevice?: Resolver<ResolversTypes['Device'], ParentType, ContextType, RequireFields<MutationAddDeviceArgs, 'device'>>;
};

export type SubscriptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  sensorData?: SubscriptionResolver<ResolversTypes['SensorData'], "sensorData", ParentType, ContextType, RequireFields<SubscriptionSensorDataArgs, 'sensorName' | 'dataType'>>;
};

export type AuthTokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthToken'] = ResolversParentTypes['AuthToken']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  expiredAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SensorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Sensor'] = ResolversParentTypes['Sensor']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dataType?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type SensorDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['SensorData'] = ResolversParentTypes['SensorData']> = {
  value?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RemoteControllerResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoteController'] = ResolversParentTypes['RemoteController']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buttons?: Resolver<Array<ResolversTypes['RemoteControllerButton']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RemoteControllerButtonResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoteControllerButton'] = ResolversParentTypes['RemoteControllerButton']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type WidgetResolvers<ContextType = any, ParentType extends ResolversParentTypes['Widget'] = ResolversParentTypes['Widget']> = {
  __resolveType: TypeResolveFn<'SensorWidget' | 'RemoteControllerWidget', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
};

export type SensorWidgetResolvers<ContextType = any, ParentType extends ResolversParentTypes['SensorWidget'] = ResolversParentTypes['SensorWidget']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dataType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type RemoteControllerWidgetResolvers<ContextType = any, ParentType extends ResolversParentTypes['RemoteControllerWidget'] = ResolversParentTypes['RemoteControllerWidget']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  controllerId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DeviceResolvers<ContextType = any, ParentType extends ResolversParentTypes['Device'] = ResolversParentTypes['Device']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['DeviceTypeData'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  willReportState?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  roomHint?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  traits?: Resolver<Array<ResolversTypes['Trait']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type TraitResolvers<ContextType = any, ParentType extends ResolversParentTypes['Trait'] = ResolversParentTypes['Trait']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['TraitType'], ParentType, ContextType>;
  attributesProvider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  statesProvider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  commandsProvider?: Resolver<ResolversTypes['Provider'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type ProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Provider'] = ResolversParentTypes['Provider']> = {
  traitId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ProviderType'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type DeviceTypeDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeviceTypeData'] = ResolversParentTypes['DeviceTypeData']> = {
  type?: Resolver<ResolversTypes['DeviceType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType>;
};

export type Resolvers<ContextType = any> = {
  Upload?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  TrueOnly?: GraphQLScalarType;
  DeviceType?: GraphQLScalarType;
  TraitType?: GraphQLScalarType;
  ProviderType?: GraphQLScalarType;
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  AuthToken?: AuthTokenResolvers<ContextType>;
  Sensor?: SensorResolvers<ContextType>;
  SensorData?: SensorDataResolvers<ContextType>;
  RemoteController?: RemoteControllerResolvers<ContextType>;
  RemoteControllerButton?: RemoteControllerButtonResolvers<ContextType>;
  Widget?: WidgetResolvers;
  SensorWidget?: SensorWidgetResolvers<ContextType>;
  RemoteControllerWidget?: RemoteControllerWidgetResolvers<ContextType>;
  Device?: DeviceResolvers<ContextType>;
  Trait?: TraitResolvers<ContextType>;
  Provider?: ProviderResolvers<ContextType>;
  DeviceTypeData?: DeviceTypeDataResolvers<ContextType>;
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
