/*
This file uses the library "Blockly" developed by Google
More details can be found on "LiteForge-Evo/Third-party libraries/Blocky LICENSE"
*/

// This file contains all the custom blocks and custom codes to run the blocks.

// Custom Codes to Run Blocks (below)


// Custom blocks through JSON (below)
Blockly.common.defineBlocksWithJsonArray([
  {
    "type": "repeat_forever",
    "message0": "Repeat Forever %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "repeat-forever"
      }
    ],
    "colour": 120,
    "tooltip": "Repeats something forever."
  },

  {
    "type": "comment_block",
    "message0": "Comment: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "COMMENT",
        "text": "Enter your comment here"
      }
    ],
    "colour": 0,
    "tooltip": "This block is used for adding comments."
  },

  {
    "type": "wait",
    "message0": "Wait %1 ms %2",
    "args0": [
      {
        "type": "field_number",
        "name": "TIME",
        "value": 1000
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": 230,
    "tooltip": "Waits for a specified number of milliseconds before executing the contained code.",
    "previousStatement": null,
    "nextStatement": null
  },

  {
    "type": "create_object",
    "message0": "Create object %1 size w%2, h%3",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "OBJECT_TYPE",
        "options": [
          ["Cube", "cube"],
          ["Sphere", "sphere"],
          ["Cylinder", "cylinder"]
        ]
      },
      {
        "type": "field_number",
        "name": "H_VALUE",
        "value": 100
      },
      {
        "type": "field_number",
        "name": "W_VALUE",
        "value": 100
      }
    ],
    "colour": 230,
    "tooltip": "Creates a new object based on the selected type.",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },  

  {
    "type": "if_game_started",
    "message0": "If game loaded %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": 210,
    "tooltip": "Execute the enclosed code if the game has started."
  },

  {
    "type": "any_key_pressed",
    "message0": "Any key pressed %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": 160,
    "tooltip": "Triggers actions when any key is pressed.",
    "previousStatement": null,
    "nextStatement": null
  },

  {
    "type": "specific_key_pressed",
    "message0": "Key %1 pressed %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "KEY",
        "options": [
          ["A", "65"], ["B", "66"], ["C", "67"], ["D", "68"], ["E", "69"], ["F", "70"],
          ["G", "71"], ["H", "72"], ["I", "73"], ["J", "74"], ["K", "75"], ["L", "76"],
          ["M", "77"], ["N", "78"], ["O", "79"], ["P", "80"], ["Q", "81"], ["R", "82"],
          ["S", "83"], ["T", "84"], ["U", "85"], ["V", "86"], ["W", "87"], ["X", "88"],
          ["Y", "89"], ["Z", "90"], ["0", "48"], ["1", "49"], ["2", "50"], ["3", "51"],
          ["4", "52"], ["5", "53"], ["6", "54"], ["7", "55"], ["8", "56"], ["9", "57"],
          ["Space", "32"], ["Enter", "13"], ["Shift", "16"], ["Ctrl", "17"], ["Alt", "18"],
          ["Tab", "9"], ["Backspace", "8"], ["Escape", "27"], ["Arrow Up", "38"], 
          ["Arrow Down", "40"], ["Arrow Left", "37"], ["Arrow Right", "39"]
        ]
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": 160,
    "tooltip": "Triggers actions when a specific key is pressed.",
    "previousStatement": null,
    "nextStatement": null
  },

  {
    "type": "Object_Will",
    "message0": "%1 Object Will %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "Options",
        "options": objectArray
      },
      {
        "type": "input_statement",
        "name": "ObjectWillAction"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 225,
    "inputsInline": false
  },

  {
    "type": "delete_object",
    "tooltip": "",
    "helpUrl": "",
    "message0": "Delete %1",
    "args0": [
      {
        "type": "input_dummy",
        "name": "OBJECT",
        "align": "CENTRE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 0
  }        
]);

function redefineBlockWithArray(array) {
  Blockly.common.defineBlocksWithJsonArray([
    {
      "type": "Object_Will",
      "message0": "%1 Object Will %2",
      "args0": [
        {
          "type": "field_dropdown",
          "name": "Options",
          "options": array,
        },
        {
          "type": "input_statement",
          "name": "ObjectWillAction"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": 225,
      "inputsInline": false
    }
  ]);
}

/* JavaScript to run the blocks (below) */
// Custom block. "Repeat Forever Block".
javascript.javascriptGenerator.forBlock['repeat_forever'] = function(block) {
  // Get the statements inside the block
  const statementsRepeatForever = javascript.javascriptGenerator.statementToCode(block, 'repeat-forever');

  // Generate code for an infinite loop
  const code = 'while (true) {\n' + statementsRepeatForever + '}\n';
  return code;
};

// "Comment Block".
javascript.javascriptGenerator.forBlock['comment_block'] = function(block) {
  // Get the comment text from the block
  const commentText = block.getFieldValue('COMMENT');

  // Return a comment in the generated code (or an empty string if no code should be generated)
  const code = `// ${commentText}\n`;
  return code;
};

// "Wait Block"
javascript.javascriptGenerator.forBlock['wait'] = function(block) {
  // Get the wait time in milliseconds
  const time = block.getFieldValue('TIME');
  
  // Get the statements inside the block
  const statements = javascript.javascriptGenerator.statementToCode(block, 'DO');
  
  // Generate code to wait and then execute the statements
  const code = `setTimeout(function() {\n${statements}\n}, ${time});\n`;
  
  return code;
};


// "If Game Started Block"
javascript.javascriptGenerator.forBlock['if_game_started'] = function(block) {
  // Get the statements inside the block
  const statements = javascript.javascriptGenerator.statementToCode(block, 'DO');
  
  // Generate a unique identifier for this trigger
  const uniqueId = 'TheUniqueIDToRun1'
  
  // Return the code to set up the DOMContentLoaded event listener
  const code = `
    (function() {
      function executeIfLoaded() {
        if (!window._gameStartedTriggered_${uniqueId}) {
          ${statements}
          window._gameStartedTriggered_${uniqueId} = true;
        }
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', executeIfLoaded);
      } else {
        executeIfLoaded();
      }
    })();
  `;
  
  return code;
};

// "Any key pressed"
javascript.javascriptGenerator.forBlock['any_key_pressed'] = function(block) {
  // Get the statements to execute when any key is pressed
  const statements = javascript.javascriptGenerator.statementToCode(block, 'DO');
  
  // The event listener for any key press
  const code = `
    document.addEventListener('keydown', function(event) {
      ${statements}
    });
  `;
  return code;
};



// "Specific Key Pressed"
javascript.javascriptGenerator.forBlock['specific_key_pressed'] = function(block) {
  // Get the selected key from the dropdown
  const keyCode = block.getFieldValue('KEY');
  
  // Get the statements to execute when the specific key is pressed
  const statements = javascript.javascriptGenerator.statementToCode(block, 'DO');
  
  // Add the event listener for the specific key press
  const code = `
    document.addEventListener('keydown', function(event) {
      if (event.keyCode === ${keyCode}) {
        ${statements}
      }
    });
  `;
  return code;
};

// "Object will"
javascript.javascriptGenerator.forBlock['Object_Will'] = function(block) {
  var objectId = block.getFieldValue('Options'); // Get the selected object ID
  var statements = Blockly.JavaScript.statementToCode(block, 'ObjectWillAction');
  
  // Generate code to store the object ID and handle the nested statements
  var code = `${objectId}\n`;
  code += `var object_${objectId} = {}; \n`;
  code += statements;
  
  return code;
};

javascript.javascriptGenerator.forBlock['delete_object'] = function(block) {
  var object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  
  // Generate code to delete the object
  var code = `\n`;
  code += `delete object_${object};\n`;
  
  return code;
};
javascript.javascriptGenerator.forBlock['create_object'] = function(block) {
  const objectType = block.getFieldValue('OBJECT_TYPE');
  const objectWSize = block.getFieldValue('W_VALUE');
  const objectHSize = block.getFieldValue('H_VALUE');

  let code = '';  // Initialize the code variable

  // Determine the object type and create the corresponding Konva shape
  if (objectType === 'cube') {
    // Create a 'cube' using a rectangle (as a 2D approximation of a cube)
    code = `const cube = new Konva.Rect({
      x: 100, 
      y: 100, 
      width: ${objectWSize}, 
      height: ${objectHSize}, 
      fill: "blue", 
      draggable: true 
    });
    layer.add(cube);`;
  } else if (objectType === 'sphere') {
    // Create a 'sphere' using a circle (as a 2D approximation of a sphere)
    code = `const sphere = new Konva.Circle({
      x: 100, 
      y: 100, 
      radius: ${objectWSize / 2},  // Assuming W_VALUE is diameter, so divide by 2 to get the radius
      fill: "red", 
      draggable: true 
    });
    layer.add(sphere);`;
  } else if (objectType === 'cylinder') {
    // Create a 'cylinder' using an ellipse (as a 2D approximation of a cylinder)
    code = `const cylinder = new Konva.Ellipse({
      x: 100, 
      y: 100, 
      radiusX: ${objectWSize / 2},  // Assuming W_VALUE is the full width of the cylinder
      radiusY: ${objectHSize / 2},  // Assuming H_VALUE is the full height of the cylinder
      fill: "green", 
      draggable: true 
    });
    layer.add(cylinder);`;
  }

  return code;
};
