// vi: ft=javascript

$(document).ready( function() {
		var $flowchart = $( '#main' );
		$flowchart.width( 20000 ).height( 20000 );
    var $container = $( window );//flowchart.parent();
    
    var cx = $flowchart.width() / 2;
    var cy = $flowchart.height() / 2;

	
    var data = {
        operators: {
        }
    };


    // Panzoom initialization...
    $flowchart.panzoom();
    
    // Centering panzoom
    $flowchart.panzoom('pan', -cx + $container.width() / 2, -cy + $container.height() / 2);

    // Panzoom zoom handling...
    var possibleZooms = [0.5, 0.75, 1, 2, 3];
    var currentZoom = 2;
    $container.on('mousewheel.focal', function( e ) {
        e.preventDefault();
        var delta = (e.delta || e.originalEvent.wheelDelta) || e.originalEvent.detail;
        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
        currentZoom = Math.max(0, Math.min(possibleZooms.length - 1, (currentZoom + (zoomOut * 2 - 1))));
        $flowchart.flowchart('setPositionRatio', possibleZooms[currentZoom]);
        $flowchart.panzoom('zoom', possibleZooms[currentZoom], {
            animate: false,
            focal: e
        });
		});

    var $draggableOperators = $('.draggable_operator');
    
    function getOperatorData($element) {
      var nbInputs = parseInt($element.data('nb-inputs'));
      var nbOutputs = parseInt($element.data('nb-outputs'));
      var data = {
        properties: {
          title: $element.text(),
          inputs: {},
          outputs: {}
        } 
      };
      
      var i = 0;
      for (i = 0; i < nbInputs; i++) {
        data.properties.inputs['input_' + i] = {
          label: 'Input ' + (i + 1)
        };
      }
      for (i = 0; i < nbOutputs; i++) {
        data.properties.outputs['output_' + i] = {
          label: 'Output ' + (i + 1)
        };
      }
      
      return data;
    }
    
    var operatorId = 0;
        
    $draggableOperators.draggable({
        cursor: "move",
        opacity: 0.7,
        
        helper: 'clone', 
        appendTo: 'body',
        zIndex: 1000,
        
        helper: function(e) {
          var $this = $(this);
          var data = getOperatorData($this);
          return $flowchart.flowchart('getOperatorElement', data);
        },
        stop: function(e, ui) {
            var $this = $(this);
            var elOffset = ui.offset;
            var containerOffset = $container.offset();
            if (elOffset.left > containerOffset.left &&
                elOffset.top > containerOffset.top && 
                elOffset.left < containerOffset.left + $container.width() &&
                elOffset.top < containerOffset.top + $container.height()) {

                var flowchartOffset = $flowchart.offset();

                var relativeLeft = elOffset.left - flowchartOffset.left;
                var relativeTop = elOffset.top - flowchartOffset.top;

                var positionRatio = $flowchart.flowchart('getPositionRatio');
                relativeLeft /= positionRatio;
                relativeTop /= positionRatio;
                
                var data = getOperatorData($this);
                data.left = relativeLeft;
                data.top = relativeTop;
                
                $flowchart.flowchart('addOperator', data);
            }
        }
    });

   $flowchart.flowchart({
        data: data,
    });


	$( '#save').on( 'click', function() {
			
			var data = $flowchart.flowchart( 'getData' );
			data.location = $( '#location' ).val()
			data.story = $( '#story' ).val()
			data = encode( JSON.stringify( data, null, 4));


			var blob = new Blob( [ data ], {
					type: 'application/octet-stream'
			});
			
			url = URL.createObjectURL( blob );
			var link = document.createElement( 'a' );
			link.setAttribute( 'href', url );
			var name = $( '#story' ).val() || "story"
			link.setAttribute( 'download', name + '.json' );
			
			var event = document.createEvent( 'MouseEvents' );
			event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			link.dispatchEvent( event );
	});

	$( '#load' ).on( 'click', function() {
		var fileInput = $('#selectFiles');
		fileInput.click()
	});

	$( '#selectFiles' ).change( function() {
		var files = $( '#selectFiles' )[0].files;
		var fr = new FileReader();

		fr.onload = function(e) { 
			var result = JSON.parse(e.target.result);
			$( '#location' ).val( result.location || '' )
			$( '#story' ).val( result.story || '' )
			$flowchart.flowchart( 'setData', result );
		}
		fr.readAsText(files.item(0));
	});

	$( '#delete' ).click( function() {
		$flowchart.flowchart( 'deleteSelected' );
	});

	$( '#add-text' ).click( function() {
		var title = Math.random()
		var data = $flowchart.flowchart("getOperatorData", $flowchart.flowchart( "getSelectedOperatorId" ) );
		var t = cy;
		var l = cx;

		if( data.top !== undefined ) {
			t = data.top
		}

		if( data.left !== undefined ) {
			l = data.left
		}

		var text = {
			top:t + 20,
			left:l + 20,
			properties: {
					title: '',
					inputs: {
							input_1: {
									label: '',
							},
					},
					outputs: {
							output_1: {
									label: '',
							},
					}
			}
		}
			
		$flowchart.flowchart( 'createOperator', title, text );
		$flowchart.flowchart( 'selectOperator', title );
	});

	$( '#add-choice' ).click( function() {
		var title = Math.random()
		var data = $flowchart.flowchart("getOperatorData", $flowchart.flowchart( "getSelectedOperatorId" ) );
		var t = cy;
		var l = cx;

		if( data.top !== undefined ) {
			t = data.top
		}

		if( data.left !== undefined ) {
			l = data.left
		}

		var text = {
			top:t + 20,
			left:l + 20,
			properties: {
					title: '',
					inputs: {
							input_1: {
									label: '',
							},
					},
					outputs: {
							output_1: {
									label: '',
							},
							output_2: {
									label: '',
							},
					}
			}
		}
			
		$flowchart.flowchart( 'createOperator', title, text );
		$flowchart.flowchart( 'selectOperator', title );
	});




} );


function encode( s ) {
    var out = [];
    for ( var i = 0; i < s.length; i++ ) {
        out[i] = s.charCodeAt(i);
    }
    return new Uint8Array( out );
}
0
