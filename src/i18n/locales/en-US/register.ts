// Recording a sighting (3 steps) and the upload messages.
export default {
	stepCount: 'Step {{step}} of {{total}}',
	steps: {
		1: { title: 'Sighting photos', hint: 'Add at least one photo.' },
		2: { title: 'What were the ibises doing?', hint: 'Choose one or more behaviors.' },
		3: { title: 'Where and when?', hint: 'We filled in your current location and time.' },
	},
	back: 'Back',
	continue: 'Continue',
	sending: 'Sending...',
	save: 'Save record',
	placeTitle: 'Sighting location',
	dateTitle: 'Date and time',
	futureError: 'The date and time cannot be in the future.',
	images: {
		add: 'Add photos',
		preparing: 'Preparing images...',
		tap: 'Tap to add photos',
		multiple: 'You can choose more than one',
		photoOf: 'Photo {{n}} of {{total}}',
		remove: 'Remove image',
	},
	location: {
		mapA11y: 'Map to choose the record location',
		confirmA11y: 'Confirm location',
		confirm: 'Confirm Location',
		selected: 'Location selected',
		current: 'Current device location',
		changeA11y: 'Location selected. Change on the map',
		chooseA11y: 'Choose location on the map. Using the device location',
		useDevice: 'Use the device location',
	},
	dateTime: {
		dateA11y: 'Sighting date: {{value}}. Change',
		timeA11y: 'Sighting time: {{value}}. Change',
	},
	feedback: {
		sent: {
			title: 'Record sent',
			message: 'Record sent for processing successfully.',
		},
		saved: {
			title: 'Record saved',
			message: 'Could not send right now. The record was saved on the device and will be sent automatically.',
		},
		imageRequired: {
			title: 'Image required',
			message: 'Add at least one image to save the record.',
		},
		behaviorInvalid: {
			title: 'Invalid behavior',
			message: 'Select a valid behavior to send the record.',
		},
		locationPermission: {
			title: 'Permission needed',
			message: 'Allow access to your location to send the record.',
		},
		photosPermission: {
			title: 'Permission needed',
			message: 'Allow access to your photos to add images.',
		},
		imageTooLarge: {
			title: 'Image too large',
			message: 'Each image must be 5 MB or less.',
		},
		galleryError: {
			title: 'Could not open gallery',
			message: 'Could not access the gallery. Try again.',
		},
		uploadImage: {
			title: 'Images too large',
			message: 'Each image must be 5 MB or less.',
		},
		uploadTotal: {
			title: 'Images too large',
			message: 'The images add up to more than 10 MB. Remove one.',
		},
		locationUnavailable: {
			title: 'Location unavailable',
			message:
				'Could not get the device location. Choose the location on the map or try again somewhere with a GPS signal.',
		},
		sendFailed: {
			title: 'Upload failed',
			message: 'Could not send the record. Try again.',
		},
	},
}
