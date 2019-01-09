<template>
  <div class="home">
    <div class="devices">
      <v-card v-for="device in user.devices" :key="device.id">
        <v-card-title style="padding: 5px 16px 0;">
          <div>
            <div class="headline">
              {{device.name}}
            </div>
            <div class="grey--text body-1">{{device.defaultNames || 'No defaultNames'}}</div>
            <div class="grey--text">{{device.nicknames || 'No nicknames'}}</div>
          </div>
          <v-spacer/>
          <v-icon large>{{ (deviceType.find((d) => d.name === device.type) || {}).icon}}</v-icon>
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outline @click="$set(device, 'show', !device.show)">
            more
            <v-icon right>{{ device.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-actions>

        <v-slide-y-transition>
          <v-list v-show="device.show">
            <v-list-tile>
              <span>ID</span>
              <v-spacer/>
              <span>{{device.id}}</span>
            </v-list-tile>
            <v-list-tile v-for="t in device.traits" :key="t.type">
              <span>{{t.type}}</span>
              <v-spacer/>
              <span>{{t.state}}</span>
            </v-list-tile>
            <v-list-tile>
              <v-btn block outline color="primary"
                @click="() => {
                  dialogs.addDevice = {
                    show: false,
                    edit: true,
                    id: device.id,
                    type: device.type,
                    name: device.name,
                    traits: device.traits,
                    defaultNames: device.defaultNames.split(',').filter(v => v.length > 0),
                    nicknames: device.nicknames.split(',').filter(v => v.length > 0),
                  };
                  $nextTick(() => dialogs.addDevice.show = true);
                }">
                <v-icon left>fas fa-edit</v-icon>
                edit
              </v-btn>
            </v-list-tile>
            <v-list-tile>
              <apollo-mutation style="width: 100%;"
                               :mutation="require('../graphql/DeleteDevice.gql')"
                               :variables="{
                  deviceId: device.id,
                }" @done="user.devices.splice(user.devices.indexOf(device), 1)">
                <template slot-scope="{ mutate, loading }">
                  <v-btn block outline
                         :disabled="loading" @click="() => {
                    dialogs.deleteDevice.func = mutate;
                    dialogs.deleteDevice.show = true;
                  }" color="error">
                    <v-icon left>fas fa-trash-alt</v-icon>
                    delete
                  </v-btn>
                </template>
              </apollo-mutation>
            </v-list-tile>
          </v-list>
        </v-slide-y-transition>
      </v-card>
      <v-card ripple color="transparent" class="elevation-0"
              height="131" @click="() => {
                dialogs.addDevice.show = true;
                dialogs.addDevice.edit = false;
              }">
        <v-layout align-center justify-center fill-height class="add-device-button">
          <v-icon large>fas fa-plus</v-icon>
        </v-layout>
      </v-card>
    </div>

    <v-dialog v-model="dialogs.addDevice.show" max-width="600">
      <v-card>
        <v-card-title>
          <span class="headline">{{dialogs.addDevice.edit ? 'Edit' : 'Add'}} Device</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="addDeviceForm" lazy-validation>
            <v-select v-model="dialogs.addDevice.type"
                      :rules="[v => !!v || 'Type is required']"
                      :items="deviceType.map(d => d.name)" label="type*" required/>

            <div class="subheading">Name</div>
            <v-combobox chips multiple deletable-chips label="default names(multiple)"
                        v-model="dialogs.addDevice.defaultNames" :append-icon="null"/>
            <v-text-field label="name*" :rules="[v => !!v || 'Name is required']"
                          v-model="dialogs.addDevice.name" required/>
            <v-combobox chips multiple deletable-chips label="nicknames(multiple)"
                        v-model="dialogs.addDevice.nicknames" :append-icon="null"/>

            <div class="subheading" style="display: flex;">
              Traits
              <v-spacer/>
              <v-menu v-if="addDeviceFilteredTraits.length > 0" max-height="30vh">
                <v-btn slot="activator" icon>
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="trait in addDeviceFilteredTraits" :key="trait"
                               @click="dialogs.addDevice.traits
                                          .push({ type: trait , info: {} })">
                    {{trait}}
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            <v-list>
              <template v-for="(trait, i) in dialogs.addDevice.traits">
                <trait-input-list-tile :key="trait.type"
                                       :type="trait.type" :info="trait.info"
                                       @delete="dialogs.addDevice.traits.splice(i, 1)"/>
                <v-divider :key="i" />
              </template>
            </v-list>
          </v-form>
        </v-card-text>

        <v-card-actions style="padding-top: 0">
          <v-spacer/>
          <v-btn flat @click="resetAddDevice(false)">Cancel</v-btn>
          <v-btn flat color="error" @click="resetAddDevice(true)">Reset</v-btn>
          <apollo-mutation
            :mutation="dialogs.addDevice.edit
              ? require('../graphql/EditDevice.gql')
              : require('../graphql/AddDevice.gql')"
            :variables="{
              deviceId: dialogs.addDevice.edit ? dialogs.addDevice.id : undefined,
              device: {
                type: dialogs.addDevice.type,
                name: dialogs.addDevice.name,
                defaultNames: dialogs.addDevice.defaultNames.join(','),
                nicknames: dialogs.addDevice.nicknames.join(','),
                traits: dialogs.addDevice.traits.map(t => ({
                  type: t.type,
                  info: JSON.stringify(t.info),
                })),
              },
            }"
            @done="doneAddDevice">
            <template slot-scope="{ mutate, loading }">
              <v-btn flat color="primary" :disabled="loading" @click="() => {
                if ($refs.addDeviceForm.validate()) mutate();
              }">{{ dialogs.addDevice.edit ? 'Edit' : 'Add' }}
              </v-btn>
            </template>
          </apollo-mutation>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogs.deleteDevice.show" max-width="250">
      <v-card>
        <v-card-title>
          <span class="headline">Delete Device</span>
        </v-card-title>
        <v-card-text>
          Do you want to delete it?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat color="error" @click="() => {
            dialogs.deleteDevice.func();
            dialogs.deleteDevice.show = false;
          }">
            Delete
          </v-btn>
          <v-btn flat @click="dialogs.deleteDevice.show = false">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn fab fixed bottom right @click="$apollo.queries.user.refetch()">
      <v-icon>fas fa-sync-alt</v-icon>
    </v-btn>
  </div>
</template>

<script>
import TraitInputListTile from '../components/TraitInputListTile.vue';
import UserQuery from '../graphql/Home.gql';

export default {
  components: {
    TraitInputListTile,
  },
  name: 'Home',
  apollo: {
    user: {
      query: UserQuery,
      update({ user }) {
        user.devices.forEach((d) => {
          d.traits.forEach((t) => {
            // eslint-disable-next-line no-param-reassign
            if (typeof t.info === 'string') t.info = JSON.parse(t.info);
          });
        });
        return user;
      },
    },
  },
  data() {
    return {
      user: {},
      deviceType: [
        {
          name: 'ACUnit',
          icon: 'ac_unit',
        }, {
          name: 'AirPurifier',
          icon: 'waves',
        }, {
          name: 'Camera',
          icon: 'camera_alt',
        }, {
          name: 'CoffeeMaker',
          icon: 'fas fa-coffee',
        }, {
          name: 'DishWasher',
          icon: 'fas fa-tint',
        }, {
          name: 'Dryer',
          icon: 'fas fa-spa',
        }, {
          name: 'Fan',
          icon: 'fas fa-asterisk',
        }, {
          name: 'Kettle',
          icon: 'fas fa-prescription-bottle',
        }, {
          name: 'Light',
          icon: 'fas fa-lightbulb',
        }, {
          name: 'Outlet',
          icon: 'fas fa-plug',
        }, {
          name: 'Oven',
          icon: 'fas fa-th-large',
        }, {
          name: 'Refrigerator',
          icon: 'fas fa-th',
        }, {
          name: 'Scene',
          icon: 'fas fa-square-full',
        }, {
          name: 'Sprinkler',
          icon: 'fas fa-beizer-curve',
        }, {
          name: 'Switch',
          icon: 'fas fa-toggle-on',
        }, {
          name: 'Thermostat',
          icon: 'fas fa-thermometer-half',
        }, {
          name: 'Vacuum',
          icon: 'fas fa-broom',
        }, {
          name: 'Washer',
          icon: 'local_laundry_service',
        },
      ],
      traitType: ['Brightness', 'CameraStream', 'Dock', 'FanSpeed', 'Locator', 'Modes', 'OnOff', 'RunCycle', 'Scene', 'StartStop', 'TemperatureControl', 'TemperatureSetting', 'Toggles'],
      dialogs: {
        addDevice: {
          show: false,
          edit: false,
          id: undefined,
          type: '',
          name: '',
          defaultNames: [],
          nicknames: [],
          traits: [],
        },
        deleteDevice: {
          show: false,
          func: undefined,
        },
      },
    };
  },
  computed: {
    addDeviceFilteredTraits() {
      return this.traitType.filter(t => !this.dialogs.addDevice.traits
        .map(v => v.type)
        .includes(t));
    },
  },
  methods: {
    doneAddDevice({ data }) {
      if (this.dialogs.addDevice.edit) {
        this.user.devices.splice(
          this.user.devices.findIndex(d => d.id === this.dialogs.addDevice.id),
          1,
          {
            ...data.editDevice,
            traits: data.editDevice.traits
              .map(t => (typeof t.info === 'string' ? ({ ...t, info: JSON.parse(t.info) }) : t.info)),
          },
        );
      } else {
        this.user.devices.push({
          ...data.addDevice,
          traits: data.addDevice.traits
            .map(t => (typeof t.info === 'string' ? ({ ...t, info: JSON.parse(t.info) }) : t.info)),
        });
      }
      this.resetAddDevice(false);
    },
    resetAddDevice(show) {
      this.dialogs.addDevice = {
        show,
        edit: this.dialogs.addDevice.edit,
        id: undefined,
        type: '',
        defaultNames: [],
        name: '',
        nicknames: [],
        traits: [],
      };
    },
  },
};
</script>

<style scoped lang="scss">
.devices {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  column-gap: 10px;
  row-gap: 10px;
  justify-content: center;
  align-items: start;
}

.add-device-button {
  border: rgba(0, 0, 0, 0.15) dashed 4px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
