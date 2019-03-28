define(['vue', 'common', "jquery"], function (Vue, common, $) {
	common.test();

	var v = new Vue({
		el: "#main",
		data: {
			constraints: {audio: false,
				video: true},
			playing: false,
			streaming: false,
			track: null,
		},

		methods: {
			uploadImage(e) {
				$('input[type=file]').trigger('click');
				return false;
			},

			async start(e) {
				try {
					const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
					this.handleSuccess(stream);
					this.playing = true;
				} catch (e) {
					this.handleError(e);
				}
			},

			stop() {
				track.stop();
				this.playing = false;
				video.srcObject = null;
			},

			startStreaming() {
				this.streaming = true;
			},

			stopStreaming() {
				this.streaming = false;
			},

			handleSuccess(stream) {
				video = document.getElementById('media');
				track = stream.getVideoTracks()[0];
				video.srcObject = stream;
			},

			handleError(error) {
				if (error.name === 'ConstraintNotSatisfiedError') {
					let v = constraints.video;
					errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
				} else if (error.name === 'PermissionDeniedError') {
					errorMsg('Permissions have not been granted to use your camera and ' +
						'microphone, you need to allow the page access to your devices in ' +
						'order fo	r the demo to work.');
				}
				console.log(`getUserMedia error: ${error.name}`, error);
			}
		}
	});
});