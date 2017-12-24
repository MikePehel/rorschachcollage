app.documents.add(4320, 6480, 180, "Sizer",  NewDocumentMode.RGB, DocumentFill.WHITE);
app.preferences.rulerUnits = Units.PIXELS; 

//File Locations
var centerpieceFolder = Folder("{{replace}}/center");
var sideFolder = Folder("{{replace}}/side");
var verticalFolder = Folder("{{replace}}/vertical");
var mainFlowerFolder = Folder("{{replace}}/flowerMain");
var subFlowerFolder = Folder("{{replace}}/flowerSub");

//Read files
var centerFileList = centerpieceFolder.getFiles();
var sideFileList = sideFolder.getFiles();
var verticalFileList = verticalFolder.getFiles();
var mainFlowerFileList = mainFlowerFolder.getFiles();
var subFlowerFileList = subFlowerFolder.getFiles()

//Queuing order for images slected
var fileOrder = File("{{replace}}/demoQueues/allPermutations.txt");
fileOrder.open('e');
var arr = fileOrder.read();
var fileQueue  = eval(arr);

//Math formulas that will help place 
var docWidth= app.activeDocument.width;
var docHeight = app.activeDocument.height;
var docSize = docWidth * docHeight;
var phi = 0.61803398874989;
var docAspect = docWidth / docHeight;
var phiDocHeight = docHeight * phi;
var phiDocWidth = docWidth * phi;
var quadHeight = docHeight * .5;
var quadWidth = docWidth * .5;
var phiQuadHeight = quadHeight * phi;
var phiQuadWidth = quadWidth * phi;
var miniPhiHeight = phiQuadHeight * phi;
var miniPhiWidth = phiQuadWidth * phi;
var quad1 = [[0, 0], [quadWidth, 0], [quadWidth, quadHeight], [0, quadHeight]];
var quad2 = [[0, quadHeight], [quadWidth, quadHeight], [quadWidth, docHeight], [0, docHeight]];
var centerSel = [[0, 0], [docWidth, 0], [docWidth, docHeight], [0, docHeight]]
var phiSel = [[0, 0], [phiQuadWidth, 0], [phiQuadWidth, phiQuadHeight], [0, phiQuadHeight]];
var miniSel = [[0, 0], [miniPhiWidth, 0], [miniPhiWidth, miniPhiHeight], [0, miniPhiHeight]];
var docRef = app.activeDocument;

//functions

var findBounds = function() {
    w1 = app.activeDocument.selection.bounds[0];
    h1 = app.activeDocument.selection.bounds[1];
    w2 = app.activeDocument.selection.bounds[2];
    h2 = app.activeDocument.selection.bounds[3];
    return [w1, h1, w2, h2];
}

var coordinates = function() {
    findBounds();
    coords = [[w1,h1], [w2, h1], [w2, h2], [w1, h2]];
    return coords;
}


var resize = function(regWidth, regHeight, regSel) {
        app.activeDocument.selection.selectAll();
            selWidth = findBounds()[2] - findBounds()[0];
            selHeight = findBounds()[3] - findBounds()[1];
            selAspect = selWidth / selHeight;
            regAspect = regWidth / regHeight
            curSel = app.activeDocument.selection;
            
            if ( selAspect > regAspect ) {
                var percChange = ((regWidth / selWidth) * 100);
                curSel.resize(percChange, percChange, AnchorPosition.MIDDLECENTER);
                app.activeDocument.selection.copy();
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                app.activeDocument.selection.select(regSel);
                app.activeDocument.paste(true);
                
            } else if (selAspect < regAspect) {
                var percChange = ((regHeight / selHeight) * 100);
                curSel.resize(percChange, percChange, AnchorPosition.MIDDLECENTER);
                app.activeDocument.selection.copy();
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                app.activeDocument.selection.select(regSel);
                app.activeDocument.paste(true);
            } else {
                var percChange = ((regWidth / selWidth) * 100);
                curSel.resize(percChange, percChange, AnchorPosition.MIDDLECENTER);
                app.activeDocument.selection.copy();
                app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
                app.activeDocument.selection.select(regSel);
                app.activeDocument.paste(true);
            }
}

var release = function() {
    doAction('ReleaseMask', 'Selection');
    doAction('Select', 'Selection');  
}

var switchOut = function(layerName) {
    app.activeDocument.selection.deselect();
    app.activeDocument.activeLayer = app.activeDocument.artLayers.getByName("placeholder");
    app.activeDocument.activeLayer.remove();
    app.activeDocument.artLayers[0].name = layerName;
}

var placeholder = function(Sel) {
    Layer = app.activeDocument.artLayers.add();
    Layer.name = "placeholder";
    app.activeDocument.selection.select(Sel, SelectionType.EXTEND);
}

var phiAction = function(w1, h1, w2, h2) {
    objWidth = w2-w1;
    objHeight = h2-h1;
    objAspect = objWidth/objHeight;
    if (objAspect < .95) {
        myLayer.rotate(90, AnchorPosition.MIDDLECENTER);
        doAction('Gust','Wind');
        app.activeDocument.activeLayer = app.activeDocument.artLayers[0];
        doAction('Select', 'Selection');
        app.activeDocument.selection.translate(0, ((h2-h1)/2));
        app.activeDocument.artLayers[0].adjustColorBalance([-50,0,0],[0,0,50],[0,0,100], true);
    } else {
        doAction('Gust','Wind');
        app.activeDocument.activeLayer = app.activeDocument.artLayers[0];
        doAction('Select', 'Selection');
        app.activeDocument.selection.translate(-((w2-w1)/3), ((h2-h1)/2));
        app.activeDocument.artLayers[0].adjustColorBalance([-50,0,0],[0,0,750],[0,0,100], true);
    }
    
    }

var adjustmentW = function() {
    if (findBounds()[0] > 0) {
        w = -findBounds()[0];
        return w;
    } else {
        w = 0;
        return w;
    }
}

var adjustmentH = function() {
    if (findBounds()[1] > 0) {
        h = -findBounds()[1];
        return h;
    } else {
        h = 0;
        return h;
    }
}

var leftAdjustment = function (a, b) {
    if (a > b) {
        output = b;
    } else {
        output = a;
    }
    return output;
}

var rightAdjustment = function (a, b) {
    if (a > b) {
        output = a- b;
    } else {
        output = 0;
    }
    return output;
}


var topAdjustment = function (a,b) {
    if (a > b) {
        output = docWidth - a;
    } else {
        output = docWidth - b;
    }
    return output;
}

var bottomAdjustment = function (a,b) {
    if (a < b) {
        output = a-(b-a);
    } else {
        output = a;
    }
    return output;
}

var addZero = function (fileNum) {
    if (fileNum < 10) {
        String(fileNum);
        fileNum = '0' + fileNum;
    } else {
        String(fileNum);
    }
return fileNum;
}



var displacementFill = function(fileName, action, actionFolder) {
    app.documents.add(docWidth, docHeight, 180, fileName,  NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    app.activeDocument.selection.selectAll();
    var fillWhite = new SolidColor();
    fillWhite.hsb.brightness = 100;
    app.activeDocument.selection.fill(fillWhite);
    doAction(action, actionFolder);
    PSFile = new File("{{replace}}/displacementMaps/" + fileName);
    PSSaveOptions = new PhotoshopSaveOptions();
    app.activeDocument.saveAs(PSFile, PSSaveOptions, false, Extension.LOWERCASE);
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
    
displacementFill('DisplacementLace', 'Lace', 'Pattern');
displacementFill('DisplacementCircularLg', 'CircularTileLg', 'Pattern');
displacementFill('DisplacementCircularSm', 'CircularTileSm', 'Pattern');
displacementFill('DisplacementTriangle', 'HalfTri', 'Pattern');

app.activeDocument.close();

for (q = 0 ; q < fileQueue.length; q++) {
    
    s1 = fileQueue[q][0];
    s2 = fileQueue[q][1];
    s3 = fileQueue[q][2];
    s4 = fileQueue[q][3];
    s5 = fileQueue[q][4];
    
app.documents.add(docWidth, docHeight, 180, String(addZero(s1)) + String(addZero(s2)) + String(addZero(s3)) + String(addZero(s4)) + String(addZero(s5)), NewDocumentMode.RGB, DocumentFill.BACKGROUNDCOLOR);

//Image Placement

//Centerpiece
placeholder(centerSel);
centerpieceSel = app.activeDocument.selection.resizeBoundary(47, phi * 100, AnchorPosition.MIDDLECENTER);
centerRegion = coordinates();
centerWidth = findBounds()[2] - findBounds()[0];
centerHeight = findBounds()[3] - findBounds()[1];
open(centerFileList[fileQueue[q][0]]);
resize(centerWidth, (centerHeight), centerRegion);
doAction('Select','Selection');
release();
centerSplitW = findBounds()[0];
centerSplitH = findBounds ()[1];
centerSplitW2 = findBounds()[2];
centerSplitH2 = findBounds()[3];
switchOut("Centerpiece");

//Center Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate(myLayer, ElementPlacement.PLACEAFTER);
myLayer.duplicate(myLayer, ElementPlacement.PLACEAFTER);
var displaceFile = new File("{{replace}}/displacementMaps/DisplacementLace.psd");
//NOTE: Change to 4X for large scale
app.activeDocument.artLayers[1].applyDisplace(250, 250, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].adjustLevels(0,255, .5, 0, 155);
app.activeDocument.artLayers[1].adjustColorBalance([0,0,0],[0,0,0],[-50,-50,0], false);
app.activeDocument.artLayers[2].applyDisplace(250, 250, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[2].adjustLevels(0,255, .5, 0, 155);
app.activeDocument.artLayers[2].adjustColorBalance([0,0,0],[0,0,0],[-50,-50,0], false);
app.activeDocument.activeLayer = app.activeDocument.artLayers[2];
doAction('Flip','Selection');

//Side
placeholder(phiSel);
topQuadRegion = coordinates();
open(sideFileList[fileQueue[q][1]]);
resize(phiQuadWidth, phiQuadHeight, topQuadRegion);
doAction('Select','Selection');
pW = findBounds()[0];
pH = findBounds()[1];
pW2 = findBounds()[2];
pH2 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(centerSplitW - ((pW2 - pW) * .5) , centerSplitH);
release();
pW = findBounds()[0];
pH = findBounds()[1];
pW2 = findBounds()[2];
pH2 = findBounds()[3];
switchOut("TopQuad");

//Side Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate(myLayer, ElementPlacement.PLACEAFTER);
app.activeDocument.activeLayer = myLayer;
phiAction(pW, pH, pW2, pH2);

//Mini

//#1
placeholder(miniSel);
miniRegion = coordinates();
open(mainFlowerFileList[fileQueue[q][2]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select','Selection');
mW = findBounds()[0];
mH = findBounds()[1];
mW2 = findBounds()[2];
mH2 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(pW - ((mW2 - mW) * .25), pH - ((mH2 - mH) * .5));
app.activeDocument.selection.rotate(45, AnchorPosition.MIDDLECENTER);
release();
mW = findBounds()[0];
mH = findBounds()[1];
mW2 = findBounds()[2];
mH2 = findBounds()[3];
switchOut("TopMini 1");

//Mini Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate();
app.activeDocument.activeLayer = app.activeDocument.artLayers[1];
var displaceFile = new File("{{replace}}/displacementMaps/DisplacementCircularSm.psd");
doAction('Flip','Selection');
app.activeDocument.artLayers[1].applyDisplace(60, 240, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 240, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].adjustLevels(0,255, .5, 0, 255);
doAction('Flip','Selection');
app.activeDocument.artLayers[1].move(app.activeDocument.artLayers[0], ElementPlacement.PLACEBEFORE);

//#2
placeholder(miniSel);
miniRegion = coordinates();
open(subFlowerFileList[fileQueue[q][2]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select', 'Selection');
mW3 = findBounds()[0];
mH3 = findBounds()[1];
mW4 = findBounds()[2];
mH4 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(pW - ((mW4 - mW3) * .5), mH2 - ((mH4 - mH3) * .5));
app.activeDocument.selection.rotate(-15, AnchorPosition.MIDDLECENTER);
release();
mW3 = findBounds()[0];
mH3 = findBounds()[1];
mW4 = findBounds()[2];
mH4 = findBounds()[3];
switchOut("TopMini 2");

//#3
placeholder(miniSel);
miniRegion = coordinates();
open(subFlowerFileList[fileQueue[q][2]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select', 'Selection');
app.activeDocument.selection.rotate(90, AnchorPosition.MIDDLECENTER);
doAction('Select', 'Selection');
mW5 = findBounds()[0];
mH5 = findBounds()[1];
mW6 = findBounds()[2];
mH6 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(mW2 - ((mW6 - mW5) * .5), mH + ((mH6 - mH5) * .20) );
app.activeDocument.selection.rotate(15, AnchorPosition.MIDDLECENTER);
release();
mW5 = findBounds()[0];
mH5 = findBounds()[1];
mW6 = findBounds()[2];
mH6 = findBounds()[3];
switchOut("TopMini 3");

//Mini Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate();
app.activeDocument.activeLayer = app.activeDocument.artLayers[1];
var displaceFile = new File("{{replace}}/displacementMaps/DisplacementCircularSm.psd");
doAction('Flip','Selection');
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].applyDisplace(60, 60, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
app.activeDocument.artLayers[1].adjustLevels(25,255, .5, 0, 255);
doAction('Flip','Selection');
doAction('Select', 'Selection');
mW6 = findBounds()[2];
fH = findBounds()[1];
app.activeDocument.artLayers[1].move(app.activeDocument.artLayers[0], ElementPlacement.PLACEBEFORE);
app.activeDocument.artLayers[1].move(app.activeDocument.artLayers[4], ElementPlacement.PLACEBEFORE);
app.activeDocument.artLayers[1].move(app.activeDocument.artLayers[4], ElementPlacement.PLACEBEFORE);

//Mirror Top

var newLayerSetTop = app.activeDocument.layerSets.add();
newLayerSetTop.name = "TopLeft";

for (i = 0; i < 7; i++) {
app.activeDocument.artLayers[0].move(newLayerSetTop, ElementPlacement.INSIDE);
}

var layerRef = app.activeDocument.layers[0];
var smayerRef = app.activeDocument.layers[1];
layerRef.move(smayerRef, ElementPlacement.PLACEAFTER);

setRef = app.activeDocument.layerSets[0];
setRef.duplicate(setRef, ElementPlacement.PLACEBEFORE);
app.activeDocument.layerSets[0].name = "TopRight";

app.activeDocument.activeLayer = app.activeDocument.layerSets[0];
rW = leftAdjustment (mW, mW3);
app.activeDocument.layerSets[0].translate(-rW + (docWidth / 2), 0);
doAction('Flip', 'Selection');
app.activeDocument.activeLayer = app.activeDocument.layerSets[0].artLayers[2];
doAction('Select', 'Selection');
tW = findBounds()[2];
app.activeDocument.activeLayer = app.activeDocument.layerSets[0].artLayers[3];
doAction('Select', 'Selection');
uW = findBounds()[2];
app.activeDocument.layerSets[0].translate( topAdjustment(tW, uW) - rW, 0);

//Bottom

//Vertical
placeholder(phiSel);
topQuadRegion = coordinates();
open(verticalFileList[fileQueue[q][3]]);
resize(phiQuadWidth, phiQuadHeight, topQuadRegion);
doAction('Select','Selection');
pW3 = findBounds()[0];
pH3 = findBounds()[1];
pW4 = findBounds()[2];
pH4 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(centerSplitW - ((pW2 - pW) * .5) , pH2);
release();
pW3 = findBounds()[0];
pH3 = findBounds()[1];
pW4= findBounds()[2];
pH4 = findBounds()[3];
switchOut("BottomQuad");

//Vertical Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate();
app.activeDocument.activeLayer = app.activeDocument.artLayers[0];
var displaceFile = new File("{{replace}}/displacementMaps/DisplacementTriangle.psd");
app.activeDocument.artLayers[0].applyDisplace(100, 100, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
doAction('Select','Selection');
app.activeDocument.selection.rotate(90, AnchorPosition.MIDDLECENTER);
app.activeDocument.selection.deselect();
doAction('Gust','Wind');
doAction('Select','Selection');
app.activeDocument.selection.rotate(-90, AnchorPosition.MIDDLECENTER);
app.activeDocument.artLayers[0].adjustColorBalance([-100,0,100],[30,0,100],[0,0,0], true);
app.activeDocument.selection.deselect();
doAction('Desaturate','Color');

//Mini

//#1
placeholder(miniSel);
miniRegion = coordinates();
open(mainFlowerFileList[fileQueue[q][4]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select','Selection');
mW7 = findBounds()[0];
mH7 = findBounds()[1];
mW8 = findBounds()[2];
mH8 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(pW3 - ((mW8 - mW7) * .33), pH4 - ((mH8 - mH7) * .75));
app.activeDocument.selection.rotate(-30, AnchorPosition.MIDDLECENTER);
release();
mW7 = findBounds()[0];
mH7 = findBounds()[1];
mW8 = findBounds()[2];
mH8 = findBounds()[3];
switchOut("BottomMini 1");

//Mini #1 Displacement Layer
myLayer = activeDocument.artLayers[0];
myLayer.duplicate();
app.activeDocument.activeLayer = app.activeDocument.artLayers[1];
var displaceFile = new File("{{replace}}/displacementMaps/DisplacementCircularSM.psd");
app.activeDocument.artLayers[1].applyDisplace(120, 120, DisplacementMapType.STRETCHTOFIT, UndefinedAreas.REPEATEDGEPIXELS, displaceFile);
doAction('Flip','Selection');
doAction('Desaturate','Color');

//#2
placeholder(miniSel);
miniRegion = coordinates();
open(subFlowerFileList[fileQueue[q][4]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select', 'Selection');
mW9 = findBounds()[0];
mH9 = findBounds()[1];
mW10 = findBounds()[2];
mH10 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(pW3 - ((mW10 - mW9) * .33), mH7 - ((mH10 - mH9) * .5));
app.activeDocument.selection.rotate(0, AnchorPosition.MIDDLECENTER);
release();
mW9 = findBounds()[0];
mH9 = findBounds()[1];
mW10 = findBounds()[2];
mH10 = findBounds()[3];
switchOut("BottomMini 2");

//#3
placeholder(miniSel);
miniRegion = coordinates();
open(subFlowerFileList[fileQueue[q][4]]);
resize(miniPhiWidth, miniPhiHeight, miniRegion);
doAction('Select', 'Selection');
mW11 = findBounds()[0];
mH11 = findBounds()[1];
mW12 = findBounds()[2];
mH12 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW(), adjustmentH());
app.activeDocument.selection.translate(mW8 - ((mW12 - mW11) * .5), mH7 + ((mH12 - mH11) * .20) );
app.activeDocument.selection.rotate(-60, AnchorPosition.MIDDLECENTER);
release();
mW5 = findBounds()[0];
mH5 = findBounds()[1];
mW6 = findBounds()[2];
mH6 = findBounds()[3];
switchOut("BottomMini 3");

//Combination Displacement

app.activeDocument.artLayers[0].duplicate();
app.activeDocument.artLayers[2].duplicate();
app.activeDocument.artLayers[4].duplicate();
app.activeDocument.artLayers[2].move(app.activeDocument.artLayers[5], ElementPlacement.PLACEAFTER);
app.activeDocument.artLayers[0].move(app.activeDocument.artLayers[5], ElementPlacement.PLACEAFTER);
app.activeDocument.artLayers[3].merge();
app.activeDocument.artLayers[3].merge();
app.activeDocument.artLayers[3].duplicate();
app.activeDocument.activeLayer = app.activeDocument.artLayers[3];
doAction('LayerBlend','Selection');
app.activeDocument.activeLayer = app.activeDocument.artLayers[2];
doAction('Select', 'Selection');
app.activeDocument.activeLayer = app.activeDocument.artLayers[3];
app.activeDocument.selection.cut();
app.activeDocument.selection.deselect();
app.activeDocument.activeLayer = app.activeDocument.artLayers[1];
doAction('Select', 'Selection');
app.activeDocument.activeLayer = app.activeDocument.artLayers[3];
app.activeDocument.selection.cut();
app.activeDocument.activeLayer = app.activeDocument.artLayers[4];
doAction('Select','Selection');
app.activeDocument.selection.rotate(180, AnchorPosition.MIDDLECENTER);
doAction('Gust','Wind');
app.activeDocument.selection.rotate(270, AnchorPosition.MIDDLECENTER);
app.activeDocument.artLayers[0].remove();
app.activeDocument.artLayers[0].move(app.activeDocument.artLayers[1], ElementPlacement.PLACEAFTER);
app.activeDocument.artLayers[3].adjustColorBalance([-100,0,100],[0,50,0],[0,0,0], true);
app.activeDocument.activeLayer = app.activeDocument.artLayers[3];
doAction('Select','Selection');
lW2 = findBounds()[0];
dH1 = findBounds()[1];
dH2 = findBounds()[3];
app.activeDocument.selection.translate(0, ((dH2-dH1)/5));

app.activeDocument.activeLayer = app.activeDocument.artLayers[5];
doAction('Select','Selection');
dW1 = findBounds()[0];
dH1 = findBounds()[1];
dW2 = findBounds()[2];
dH2 = findBounds()[3];
app.activeDocument.selection.translate(((dW2-dW1)/8), ((dH2-dH1)/2));
bW = findBounds()[2];


app.activeDocument.activeLayer = app.activeDocument.artLayers[4];
doAction('Select','Selection');
dW1 = findBounds()[0];
dH1 = findBounds()[1];
dW2 = findBounds()[2];

dH2 = findBounds()[3];
app.activeDocument.selection.translate(adjustmentW (), adjustmentH ());
app.activeDocument.selection.translate((docWidth / 2) - (dW2-dW1), (docHeight / 2));

app.activeDocument.activeLayer = app.activeDocument.artLayers[4];

mW12 = findBounds()[2];
app.activeDocument.artLayers[3].move(app.activeDocument.artLayers[0], ElementPlacement.PLACEBEFORE);

var newLayerSetTop = app.activeDocument.layerSets.add();
newLayerSetTop.name = "BottomLeft";

for (i = 0; i < 7; i++) {
app.activeDocument.artLayers[0].move(newLayerSetTop, ElementPlacement.INSIDE);
}

//Combo Layer Arrangement
app.activeDocument.layerSets[0].artLayers[4].move(app.activeDocument.layerSets[0].artLayers[3], ElementPlacement.PLACEBEFORE);
app.activeDocument.layerSets[0].artLayers[5].move(app.activeDocument.layerSets[0].artLayers[3], ElementPlacement.PLACEBEFORE);
app.activeDocument.layerSets[0].artLayers[1].move(app.activeDocument.layerSets[0].artLayers[6], ElementPlacement.PLACEBEFORE);
app.activeDocument.layerSets[0].artLayers[5].move(app.activeDocument.layerSets[0].artLayers[6], ElementPlacement.PLACEAFTER);

//Mirror Bottom
var layerRef = app.activeDocument.layers[0];
var smayerRef = app.activeDocument.layers[1];
layerRef.move(smayerRef, ElementPlacement.PLACEAFTER);

setRef = app.activeDocument.layerSets[0];
setRef.duplicate(setRef, ElementPlacement.PLACEBEFORE);
app.activeDocument.layerSets[0].name = "BottomRight";

app.activeDocument.activeLayer = app.activeDocument.layerSets[0];
app.activeDocument.layerSets[0].translate(docWidth / 2, 0);
doAction('Flip', 'Selection');
app.activeDocument.activeLayer = app.activeDocument.layerSets[0].artLayers[1];
doAction('Select', 'Selection');
rW = findBounds()[0];
app.activeDocument.layerSets[0].translate(- rightAdjustment(rW, docWidth/2));

app.activeDocument.layerSets[0].artLayers[6].move(app.activeDocument.layerSets[1].artLayers[6], ElementPlacement.PLACEAFTER);

//Final Postioning
doAction('All','Selection');
app.activeDocument.activeLayer.translate(0, -fH + (docHeight / 9));

//File Save
psdFile = new File("{{replace}}/output/" +String(addZero(s1)) + String(addZero(s2)) + String(addZero(s3)) + String(addZero(s4)) + String(addZero(s5)));
psdSaveOptions = new PhotoshopSaveOptions();
psdSaveOptions.alphaChannels = true;
psdSaveOptions.embedColorProfile = true;
psdSaveOptions.layers = true;
app.activeDocument.saveAs(psdFile, psdSaveOptions, true, Extension.LOWERCASE);
jpgFile = new File("{{replace}}/output/" +String(addZero(s1)) + String(addZero(s2)) + String(addZero(s3)) + String(addZero(s4)) + String(addZero(s5)));
jpgSaveOptions = new JPEGSaveOptions();
jpgSaveOptions.embedColorProfile = true;
jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
jpgSaveOptions.matte = MatteType.NONE;
jpgSaveOptions.quality = 12;
app.activeDocument.saveAs(jpgFile, jpgSaveOptions, true, Extension.LOWERCASE);
app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}

