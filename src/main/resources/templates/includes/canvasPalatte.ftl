<script>

</script>
<div id="palatte" title="Edit Palette" >

        <div class="inline-block">
            <svg width="30" height="50">
                <circle id="shapeCircle"
                        cx="15" cy="25" r="15" stroke="black"
                        stroke-width="1" fill="white"
                        onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50">
                <rect  id="shapeRectangle"
                       x="0" y="15"
                       width="30" height="20"
                       style="fill:white;stroke-width:1;stroke:rgb(0,0,0)"
                       onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50" >
                <ellipse id="shapeEllipse"
                         cx="15" cy="25" rx="15" ry="10"
                         onClick="shadeShape(this, 'grey')"
                         style="fill:white;stroke:black;stroke-width:1" />
            </svg>

            <svg width="30" height="50">
                <rect id="shapeSquare"
                      x="5" y="15" width="20" height="20"
                      style="fill:white;stroke-width:1;stroke:rgb(0,0,0)"
                      onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50" >
                <polygon id="shapeDiamond"
                         points="15,15 30,25 15,35 0,25" 						                style="fill:white;stroke:black;stroke-width:1"
                         onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50">
                <circle id="shapeOnPageConnector"
                        cx="15" cy="25" r="7" stroke="black"
                        stroke-width="1" fill="white"
                        onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50" >
                <polygon id="shapeOffPageConnector"
                         points="5,15 25,15 25,25 15,35 5,25 5,15" 						                style="fill:white;stroke:black;stroke-width:1"
                         onClick="shadeShape(this, 'grey')"/>
            </svg>

            <svg width="30" height="50">
                <rect id="shapeGroupSelect"
                      x="0" y="10" width="30" height="30"
                      style="fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,100,0)"
                      stroke-dasharray="3, 5"
                      onClick="shadeShape(this, 'grey')"  />
                <text x="3" y="23" style="fill:green;"
                      font-family="Verdana" font-size="8"
                      style="cursor: pointer"
                      onClick="shadeShape(shapeGroupSelect, 'grey')">group
                    <tspan x="3" y="33">select</tspan>

                </text>
            </svg>

            <svg id="shapeSingleLine"
                 width="30" height="50"
                 style="background-color: white"
                 onClick="shadeBackground(this)">
                <polyline points="0,25 30,25 27,22 27,28 30,25"
                          style="fill:black;stroke:black;stroke-width:1" />
            </svg>

            <svg id="shapeDoubleLine"
                 width="30" height="50"
                 style="background-color: white"
                 onClick="shadeBackground(this)">
                <polyline points="30,25 27,28 27,22 30,25 0,25 3,22 3,28 0,25"
                          style="fill:black;stroke:black;stroke-width:1" />
            </svg>

            <svg id="shapeNoteLine"
                 width="30" height="50"
                 style="background-color: white"
                 onClick="shadeBackground(this)" >
                <polyline points="30,25 0,25"
                          style="fill:black;stroke:black;stroke-width:1"/>
            </svg>

            <div>
                Shared Shapes:
                <select id="selShapeTemplate"
                        name="selShapeTemplate"
                        class="form-control"
                        ng-model="selectedShapeTemplate"
                        onChange="checkToClearSelectedShape()"
                        ng-options="shapeTemplate.templateName for shapeTemplate in shapeTemplates | orderBy:'templateName' track by shapeTemplate.templateName">
                </select>
            </div>
        </div>
</div>