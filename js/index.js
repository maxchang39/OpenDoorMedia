define(['vue', 'common', "jquery", "coordinator"], function(Vue, common, $, coordinator) {
	common.test();

	var v = new Vue({
		el: "#main",
		data: {
			constraints: {
				audio: false,
				video: true
			},
			playing: false,
			streaming: false,
			localStream: null,
			track: null,
			channelName: "",
			channels: {},
			offerIds: [],
		},

		methods: {
			async start(e) {
				try {
					const stream = await navigator.mediaDevices.getUserMedia(this.constraints);
					this.handleSuccess(stream);
					this.playing = true;
				} catch (e) {
					this.handleError(e);
				}
			},

			async connect(name) {
				v = this;
				console.log(name);
				coordinator.getOfferByChannel(name, function(data) {
					try {
// 						const answer = await pc2.createAnswer();
// 						await onCreateAnswerSuccess(answer);
						console.log(data);
					} catch (e) {
// 						onCreateSessionDescriptionError(e);
					}
				});
			},

			stop() {
				track.stop();
				this.playing = false;
				video.srcObject = null;
				this.localStream = false;
			},

			async startStreaming() {
				var rpcConfig = {};
				var offerConfig = {};
				var v = this;

				if (confirm("Start broadcasting your channel?")) {
					this.streaming = true;
					pc1 = new RTCPeerConnection(rpcConfig);
					console.log(pc1)
					console.log('Initialize peer connection object');
					if (this.localStream == null) {
						this.streaming = false;
						alert("Local stream has not started, please try again");
					} else {
						this.localStream.getTracks().forEach(track => pc1.addTrack(track, this.localStream));
						try {
							offer = await pc1.createOffer(offerConfig);
							console.log('pc1 createOffer start');
							console.log(offer);
							console.log(JSON.stringify(offer));
							this.channelName = prompt("Please enter your channel name", "Channel Name");
							coordinator.createOffer(this.channelName, offer,
								function(data) {
									v.offerIds.push(data.id);
								});
						} catch (e) {
							console.log(e);
						}
					}
				}
			},

			onIceStateChange(pc, event) {
				if (pc) {
					console.log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
					console.log('ICE state change event: ', event);
				}
			},

			stopStreaming() {
				this.streaming = false;
			},

			handleSuccess(stream) {
				video = document.getElementById('media');
				track = stream.getVideoTracks()[0];
				video.srcObject = stream;
				this.localStream = stream;
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

	function timeout(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function syncChannel() {
		while (true) {
			console.log('Get me the channels');
			coordinator.getChannelList(function(data) {
				v.channels = data.channels;
			});
			await timeout(3000);
		}
	}

	syncChannel();
});
