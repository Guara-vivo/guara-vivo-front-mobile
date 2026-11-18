import { placeBalloon } from './balloonPlacement'

const BALLOON = { width: 232, height: 60 }
const CONTAINER = { width: 360, height: 640 }

describe('placeBalloon', () => {
	it('places the balloon centered above a marker in the middle of the map', () => {
		expect(placeBalloon({ anchor: { x: 180, y: 400 }, balloon: BALLOON, container: CONTAINER })).toEqual({
			side: 'above',
			left: 64,
			top: 309,
			pointerLeft: 116,
		})
	})

	it('slides inside the left margin and keeps the pointer on the marker', () => {
		const placement = placeBalloon({ anchor: { x: 10, y: 400 }, balloon: BALLOON, container: CONTAINER })

		expect(placement.left).toBe(16)
		expect(placement.pointerLeft).toBe(16)
	})

	it('slides inside the right margin and keeps the pointer on the marker', () => {
		const placement = placeBalloon({ anchor: { x: 355, y: 400 }, balloon: BALLOON, container: CONTAINER })

		expect(placement.left).toBe(112)
		expect(placement.pointerLeft).toBe(216)
	})

	it('goes below the marker when there is no room above (near the top and the chips)', () => {
		const placement = placeBalloon({ anchor: { x: 180, y: 120 }, balloon: BALLOON, container: CONTAINER })

		expect(placement.side).toBe('below')
		expect(placement.top).toBe(151)
	})

	it('goes below when the room above would end under the chips', () => {
		const placement = placeBalloon({ anchor: { x: 180, y: 190 }, balloon: BALLOON, container: CONTAINER })

		expect(placement.side).toBe('below')
	})

	it('picks the side with more room when neither fits', () => {
		const container = { width: 360, height: 140 }

		expect(placeBalloon({ anchor: { x: 180, y: 80 }, balloon: BALLOON, container }).side).toBe('above')
		expect(placeBalloon({ anchor: { x: 180, y: 60 }, balloon: BALLOON, container }).side).toBe('below')
	})

	it('never returns a balloon wider than the container allows', () => {
		const placement = placeBalloon({
			anchor: { x: 120, y: 400 },
			balloon: BALLOON,
			container: { width: 240, height: 640 },
		})

		expect(placement.left).toBe(16)
	})
})
