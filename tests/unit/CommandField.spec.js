import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuetify from 'vuetify';
import CommandField from '@/components/CommandField.vue';

describe('CommandField', () => {
  it('Vue instance', () => {
    const localVue = createLocalVue();
    localVue.use(Vuetify);

    const wrapper = shallowMount(CommandField, {
      localVue,
    });
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
