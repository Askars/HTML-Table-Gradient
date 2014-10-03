function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}
 
function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}
 

function gradient_function_maker(stops, colors) {
    if (stops.length < 2 || stops[0] != 0 || stops[stops.length -1] != 1) {
       return null;
    }
    return function (value) {
        var start_pos = 0;
        while (start_pos < stops.length - 1) {
            if (stops[start_pos + 1] >= value) break;
            start_pos++;
        }
        var ratio = (value - stops[start_pos])/(stops[start_pos + 1] - stops[start_pos]);

        //Duplicate instead of pass reference
        var start_colors = colors[start_pos].slice();
        var stop_colors = colors[start_pos + 1];
        
        
        for (var i = 0; i < 3; i++) {
            start_colors[i] += (stop_colors[i] - start_colors[i]) * (ratio);
        } 
        return start_colors;
    };
}


function colorit(data) {
  gradient_function = gradient_function_maker(
       [0, 0.3, 0.5, 0.7, 1], 
       [
           [20,20,255], 
           [150,150,255], 
           [255,255,255],
           [255,150,150],
           [255,20,20]
       ]
  );
  data = String(data);
  var splitdata = data.split(/\r?\n/);
  var data_array = Array();
  for (pos in splitdata) {
      data_array.push(splitdata[pos].split(","));
  }
  var action_table = document.getElementById("action_table");
  for (row in data_array) {
    var this_row = data_array[row];
    var html_dom_row = action_table.insertRow(-1);
    var this_row_ref = this_row[0];
    for (var i = 1; i < this_row.length; i++) {
        var this_value = this_row[i];
        html_dom_cell = html_dom_row.insertCell(-1);
        html_dom_cell.innerHTML = this_value;
        //console.log(this_value);
        if (this_value == 0) {
            html_dom_cell.style.backgroundColor = "black";
            html_dom_cell.style.color = "white";
        } else {
            this_value = Math.log(this_value / this_row_ref)/Math.log(2);
            if (Math.abs(this_value) > 1.5) {
                html_dom_cell.style.color = "white";
            }
            this_value = (this_value + 3) / 6;
            this_value = Math.min(1, this_value);
            this_value = Math.max(0, this_value);
            console.log(this_value);
            var rgb = gradient_function(this_value);
            html_dom_cell.style.backgroundColor = RGB2Color(rgb[0],rgb[1],rgb[2]);
        }
    }
  }
}

$.ajax({
  url: 'Paperpalooza.csv',
  success: function(data) {
    colorit(data)
  },
  dataType: 'html'
});
