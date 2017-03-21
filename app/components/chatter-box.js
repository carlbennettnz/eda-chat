import Ember from 'ember';

export default Ember.Component.extend({
  io: Ember.inject.service('socket-io'),

  socket: null,
  messages: [],
  newMessage: '',

  didInsertElement() {
    this._super(...arguments);

    const socket = this.get('io').socketFor('ws://localhost:5000/');

    socket.on('connect', () => {
      console.log('opened');

      socket.on('new-msg', message => this.addMessage(message));
      socket.on('close', () => console.log('closed'));
    });

    this.set('socket', socket);
  },

  addMessage(message) {
    this.get('messages').pushObject(message);

    Ember.run.next(() => {
      this.$('.messages').scrollTop(999999);
    });
  },

  actions: {
    send() {
      console.log('sending');
      this.get('socket').emit('new-msg', {
        sender: 'Carl',
        content: this.get('newMessage')
      });
    }
  }
});
