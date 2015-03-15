var cm, doc;
var mProved, mProving, mToprove, mUnlocked;

$(document).ready(function() {
    setupEditor($("#main-left")[0]);
});

function setupEditor(anchor) {

    cm = CodeMirror(
        anchor,
        {
            "autofocus": true,
            "extraKeys": {
                "Ctrl-Down": function(cm) { onCtrlDown(); },
                "Ctrl-Alt-Down": function(cm) { onCtrlDown(); },
                "Ctrl-Up": function(cm) {
                    onCtrlUp(false);
                },
                "Ctrl-Alt-Up": function(cm) {
                    onCtrlUp(false);
                },
                "Ctrl-Enter": function(cm) {
                    onCtrlEnter();
                },
            },
            "keyMap": "emacs",
            "lineNumbers": true,
            "lineWrapping": true,
            "matchBrackets": true,
            "mode": "text/x-coq",
        }
    );

    doc = cm.getDoc();

    resetEditor("(* Theorem easy : forall n, n = 0 \\\/ n > 0.*)\n\nPrint nat.\nPrint bool.\n");

}

function resetEditor(code) {
    doc.setValue(code);
    var zeroPos = {"line": 0, "ch": 0};
    markProved(zeroPos, zeroPos);
    markProving(zeroPos, zeroPos);
    markToprove(zeroPos, zeroPos);
    markUnlocked(zeroPos, cm.findPosH(zeroPos, code.length, "char"));
}

function bumpPosition(pos) {
    return cm.findPosH(pos, 1, "char");
}

function fromtoBumpFrom(fromto) {
    return {
        "from": bumpPosition(fromto.from),
        "to": fromto.to,
    };
}

function fromtoBumpTo(fromto) {
    return {
        "from": fromto.from,
        "to": bumpPosition(fromto.to),
    };
}

function markRegion(from, to, className, readOnly) {
    return doc.markText(
        from,
        to,
        {
            "className": className,
            "clearWhenEmpty": false,
            "inclusiveLeft": true,
            "inclusiveRight": !readOnly,
            "readOnly": readOnly,
        }
    );
}

function markProved(from, to) {
    if (mProved !== undefined) { mProved.clear(); }
    mProved = markRegion(from, to, "proved", true);
}

function markProving(from, to) {
    if (mProving !== undefined) { mProving.clear(); }
    mProving = markRegion(from, to, "proving", true);
}

function markToprove(from, to) {
    if (mToprove !== undefined) { mToprove.clear(); }
    mToprove = markRegion(from, to, "toprove", true);
}

function markUnlocked(from, to) {
    if (mUnlocked !== undefined) { mUnlocked.clear(); }
    mUnlocked = markRegion(from, to, "unlocked", false);
}

function process() {
    var unlockedFromto = mUnlocked.find();
    var toproveFromto = mToprove.find();

    // make sure there are things to process
    if (unlockedFromto.to.line > unlockedFromto.from.line
        || unlockedFromto.to.ch > unlockedFromto.from.ch) {

        markUnlocked(fromtoBumpFrom(unlockedFromto));

        markToprove(fromtoBumpTo(toproveFromto));

    }
}

function onCtrlDown() {
    var rToprove = mToprove.find();
    var rUnlocked = mUnlocked.find();
    var unlocked = doc.getRange(rUnlocked.from, rUnlocked.to);
    var nextIndex = next(unlocked);
    if (nextIndex === 0) { return; }
    var nextPos = cm.findPosH(rUnlocked.from, nextIndex, "char");
    markToprove(rToprove.from, nextPos);
    markUnlocked(nextPos, rUnlocked.to);
    doc.setCursor(nextPos);
    processToprove();
}

function onCtrlUp(fromTree) {
    if (processingToprove) { return Promise.resolve(); }
    var rProved = mProved.find();
    var rUnlocked = mUnlocked.find();
    var proved = doc.getRange(rProved.from, rProved.to);
    if (proved === "") { return Promise.resolve(); }
    var prevIndex = prev(proved);
    var pieceToUnprocess = proved.substring(prevIndex);
    if (pieceToUnprocess === "") { return Promise.resolve(); }
    var prevPos = cm.findPosH(rProved.from, prevIndex, "char");
    markProved(rProved.from, prevPos);
    markProving(prevPos, prevPos);
    markToprove(prevPos, prevPos);
    markUnlocked(prevPos, rUnlocked.to);
    asyncLog("PROVERUP " + pieceToUnprocess);
    doc.setCursor(prevPos);
    return asyncUndo()
        .then(_.partial(undoCallback, fromTree, pieceToUnprocess))
    ;
}

// a <= b ?
function positionIsBefore(a, b) {
    if (a.line < b.line) { return true; }
    if (a.line === b.line && a.ch <= b.ch) { return true; }
    return false;
}

function onCtrlEnter() {
    var cursorPos = doc.getCursor();
    var rProved = mProved.find();
    var rUnlocked = mUnlocked.find();
    if (positionIsBefore(cursorPos, rProved.to)) {
        rewindToPos(cursorPos);
    } else if (positionIsBefore(rUnlocked.from, cursorPos)) {
        processToPos(cursorPos);
    } else { // trying to jump in the proving or toprove area, ignored
        return;
    }
}

function rewindToPos(pos) {
    var rProved = mProved.find();
    if (positionIsBefore(rProved.to, pos)) {
        return Promise.resolve();
    } else {
        return onCtrlUp(false).then(function() { rewindToPos(pos); });
    }
}

function processToPos(pos) {
    var rToprove = mToprove.find();
    var rest = doc.getRange(rToprove.to, pos);
    if (coqTrim(rest) !== "") {
        onCtrlDown();
        processToPos(pos);
    }
}

var processingToprove = false;

function processToprove() {
    if (processingToprove) { return Promise.resolve(); }
    // Here, the prooftree gets a chance to modify toprove
    if (activeProofTree !== undefined) {
        activeProofTree.beforeToproveConsumption();
    }
    var rProving = mProving.find();
    var rToprove = mToprove.find();
    var toprove = doc.getRange(rToprove.from, rToprove.to);
    if (toprove === '') { return Promise.resolve(); }
    var nextIndex = next(toprove);
    var pieceToProcess = toprove.substring(0, nextIndex);
    var nextPos = cm.findPosH(rToprove.from, nextIndex, "char");
    markProving(rProving.from, nextPos);
    markToprove(nextPos, rToprove.to);
    processingToprove = true;
    return asyncQuery(pieceToProcess)
        .then(function(response) {
            processingToprove = false;
            processToprove();
        })
        .catch(outputError)
    ;
}

function getProved() {
    var rProved = mProved.find();
    return doc.getRange(rProved.from, rProved.to);
}

function getProving() {
    var rProving = mProving.find();
    return doc.getRange(rProving.from, rProving.to);
}

function getToprove() {
    var rToprove = mToprove.find();
    return doc.getRange(rToprove.from, rToprove.to);
}

function getUnlocked() {
    var rUnlocked = mUnlocked.find();
    return doc.getRange(rUnlocked.from, rUnlocked.to);
}
