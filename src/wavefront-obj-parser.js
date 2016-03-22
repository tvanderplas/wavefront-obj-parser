module.exports = ParseWavefrontObj

// Map .obj vertex info line names to our returned property names
var vertexInfoNameMap = {v: 'vertex', vt: 'uv', vn: 'normal'}
// The returned properties that we will populate
var parsedProperties = ['normal', 'uv', 'vertex', 'normalIndex', 'uvIndex', 'vertexIndex']
function ParseWavefrontObj (wavefrontString) {
  var parsedJSON = {normal: [], uv: [], vertex: [], normalIndex: [], uvIndex: [], vertexIndex: []}

  var linesInWavefrontObj = wavefrontString.split('\n')

  // Loop through and parse every line in our .obj file
  linesInWavefrontObj.forEach(function (currentLine) {
    // Tokenize our current line
    var currentLineTokens = currentLine.split(' ')
    // vertex position, vertex texture, or vertex normal
    var vertexInfoType = vertexInfoNameMap[currentLineTokens[0]]
    if (vertexInfoType) {
      parsedJSON[vertexInfoType] = parsedJSON[vertexInfoType].concat(currentLineTokens.slice(1))
      return
    }
    if (currentLineTokens[0] === 'f') {
      // Get our 4 sets of vertex, uv, and normal indices for this face
      for (var i = 1; i < 5; i++) {
        var indices = currentLineTokens[i].split('/')
        parsedJSON.vertexIndex.push(indices[0])
        parsedJSON.uvIndex.push(indices[1])
        parsedJSON.normalIndex.push(indices[2])
      }
    }
  })
  // Convert our parsed strings into floats (trims trailing insignificant `0`s)
  parsedProperties.forEach(function (property) {
    parsedJSON[property] = parsedJSON[property].reduce(function (accumulator, nextValue) {
      return accumulator.concat(parseFloat(nextValue))
    }, [])
  })
  return parsedJSON
}