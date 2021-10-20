import Phaser from 'phaser'
import eventsCenter from '../events-center.js'

export default class UIScene extends Phaser.Scene
{
    constructor()
    {
	super('ui-scene')
    }

    create()
    {
	this.statusLabel = this.add.text(10, 10, 'Not Hacking', {
	    fontSize: 32
	})

        // listen to 'update-count' event and call `updateCount()`
	// when it fires
	eventsCenter.on('start-hacking', this.startHacking, this)

	// clean up when Scene is shutdown
	this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
	    eventsCenter.off('start-hacking', this.startHacking, this)
	})
    }

    startHacking()
    {
	this.statusLabel.text = `Now Hacking`
    }
}
