var Animation = {
    name: '',
    ildaFormat: IldaFormat
}

var IldaFormat = {
    colorHeader: ColorHeader,
    colorDatas: [
        ColorData
    ],
    coordinateHeaders: [
        CoordinateHeader
    ],
    dirty: true,
    maxDepth: 0,
    maxHeight: 0,
    maxWidth: 0,
    minDepth: 0,
    minHeight: 0,
    minWidth: 0
}

var CoordinateHeader = {
    protocol: 'ILDA',
    threeD: true,
    frameName: '',
    companyName: '',
    totalPoints: 0,
    frameNumber: 0,
    totalFrames: 0,
    scannerHead: 0,
    coordinateDatas: [
        CoordinateData
    ]
}

var ColorData = {
    red1: 0,
    red2: 0,
    green1: 0,
    green2: 0,
    blue1: 0,
    blue2: 0,
    code: 0
}

var ColorHeader = {
    scannerHead: 0,
    paletteNumber: 0,
    totalColors: 0,
    companyName: '',
    paletteName: '',
    formatCode: 0,
    protocol: ''
}

var CoordinateData = {
    x: 0,
    y: 0,
    z: 0,
    colorData: ColorData,
    blanked: false,
    endImageData: false
}

var AnimationPoint = {
    x: 0,
    y: 0,
    z: 0,
    red: 0,
    green: 0,
    blue: 0,
    code: 0,
    blanked: false,
    endImageData: false
}