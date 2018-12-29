<template>
  <div class="home">
    <div class="devices">
      <v-card v-for="device in devices" :key="device.id">
        <v-card-title style="padding: 5px 16px 0;">
          <div>
            <div class="headline">
              {{device.name.name}}
              <span class="grey--text body-1">{{device.name.defaultNames.join(',')}}</span>
            </div>
            <span class="grey--text">{{device.name.nicknames.join(',')}}</span>
          </div>
          <v-spacer />
          <v-icon large>fas fa-plug</v-icon>
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
              <v-spacer />
              <span>{{device.id}}</span>
            </v-list-tile>
            <v-list-tile v-for="(v,k) in device.traits" :key="`${device.id}_${k}`">
              <span>{{k}}</span><v-spacer /><span>{{v}}</span>
            </v-list-tile>
            <v-list-tile>
              <v-btn block outline color="error">
                <v-icon left>fas fa-trash-alt</v-icon>
                delete
              </v-btn>
            </v-list-tile>
          </v-list>
        </v-slide-y-transition>
      </v-card>
      <v-card ripple color="transparent" class="elevation-0"
              height="100%" @click="dialogs.addDevice.show = true">
        <v-layout align-center justify-center fill-height class="add-device-button">
          <v-icon large>fas fa-plus</v-icon>
        </v-layout>
      </v-card>
    </div>

    <v-dialog v-model="dialogs.addDevice.show">
      <v-card>
        <v-card-title>
          <span class="headline">Add Device</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="addDeviceForm" lazy-validation>
            <v-select v-model="dialogs.addDevice.type"
                      :rules="[v => !!v || 'Type is required']"
                      :items="['Outlet', 'AC']" label="type*" required/>

            <div class="subheading">Name</div>
            <v-combobox chips multiple deletable-chips label="default names(multiple)"
                        v-model="dialogs.addDevice.defaultNames" :append-icon="null" />
            <v-text-field label="name*" :rules="[v => !!v || 'Name is required']"
                          v-model="dialogs.addDevice.name" required/>
            <v-combobox chips multiple deletable-chips label="nicknames(multiple)"
                        v-model="dialogs.addDevice.nicknames" :append-icon="null" />

            <div class="subheading" style="display: flex;">
              Traits
              <v-spacer />
              <v-menu v-if="addDeviceFilteredTraits.length > 0">
                <v-btn slot="activator" icon>
                  <v-icon>fas fa-plus</v-icon>
                </v-btn>
                <v-list>
                  <v-list-tile v-for="trait in addDeviceFilteredTraits" :key="trait"
                               @click="dialogs.addDevice.traits.push({ type: trait , state: {} })">
                    {{trait}}
                  </v-list-tile>
                </v-list>
              </v-menu>
            </div>
            <v-list>
              <trait-input-list-tile v-for="(trait, i) in dialogs.addDevice.traits"
                                     :key="trait.type"
                                     :type="trait.type" :state="trait.state"
                                     @delete="dialogs.addDevice.traits.splice(i, 1)"/>
            </v-list>
            <v-divider />
          </v-form>
        </v-card-text>

        <v-card-actions style="padding-top: 0">
          <v-spacer />
          <v-btn flat @click="resetAddDevice(false)">Cancel</v-btn>
          <v-btn flat color="error" @click="resetAddDevice(true)">Reset</v-btn>
          <v-btn flat color="primary" @click="clickAddDevice">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn fab fixed bottom right>
      <v-icon>fas fa-sync-alt</v-icon>
    </v-btn>
  </div>
</template>

<script>
import TraitInputListTile from '../components/TraitInputListTile.vue';

export default {
  components: {
    TraitInputListTile,
  },
  name: 'Home',
  data() {
    return {
      dialogs: {
        addDevice: {
          show: false,
          type: '',
          defaultNames: [],
          name: '',
          nicknames: [],
          traits: [],
        },
      },
      traits: ['OnOff', 'Brightness'],
      devices: [
        {
          id: 1,
          type: 'Outlet', // action.devices.types.
          traits: { // action.devices.traits.
            OnOff: true,
            Brightness: 50,
          },
          name: {
            defaultNames: ['Toshiba'],
            name: 'Outlet',
            nicknames: ['コンセント', 'TEST'],
          },
        },
      ],
    };
  },
  computed: {
    addDeviceFilteredTraits() {
      return this.traits.filter(t => !this.dialogs.addDevice
        .traits.map(v => v.type)
        .includes(t));
    },
  },
  methods: {
    clickAddDevice() {
      if (this.$refs.addDeviceForm.validate()) {
        this.resetAddDevice(false);
      }
    },
    resetAddDevice(show) {
      this.dialogs.addDevice = {
        show,
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
