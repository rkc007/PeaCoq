import * as d3Scale from "d3-scale"

/*
  Stuff that is somewhat general but mostly useful for the proof tree.
 */

// export function getActiveProofTree(): Maybe<IProofTree> {
//   return (
//     Global.proofTrees.length > 0
//       ? just(Global.proofTrees[0])
//       : nothing()
//   )
// }

/*
 * Returns a rect of the absolute position of [elmt] within the canvas. It needs
 * [node] in order to return absolute values, where [node] is the node element
 * within which [elmt] lives.
 */
function elmtRect(node: IProofTreeNode, elmt: HTMLElement) {
  const rect = elmt.getBoundingClientRect()
  const containerRect = $(elmt).parents("foreignObject")[0].getBoundingClientRect()
  const left = node.getDestinationScaledX() + deltaX(containerRect, rect)
  const top = node.getDestinationScaledY() + deltaY(containerRect, rect)
  return {
    "left": left, "right": left + rect.width, "width": rect.width,
    "top": top, "bottom": top + rect.height, "height": rect.height,
  }
}

// function elmtRect0(node: IProofTreeNode, elmt: HTMLElement) {
//   const rect = elmt.getBoundingClientRect()
//   const containerRect = $(elmt).parents("foreignObject")[0].getBoundingClientRect()
//   const left = node.cX0 + deltaX(containerRect, rect)
//   const top = node.cY0 + deltaY(containerRect, rect)
//   return {
//     "left": left, "right": left + rect.width, "width": rect.width,
//     "top": top, "bottom": top + rect.height, "height": rect.height,
//   }
// }

type Rectangle = {
  bottom: number
  left: number
  right: number
  top: number
}

function deltaX(rect1: Rectangle, rect2: Rectangle): number {
  return rect2.left - rect1.left
}
function deltaY(rect1: Rectangle, rect2: Rectangle): number {
  return rect2.top - rect1.top
}

function makeGoalNodePre() {
  return $("<pre>")
    .addClass("goalNode")
    // inlining some CSS for svg_datatourl
    .css("font-family", "monospace")
    .css("font-size", "14px")
    .css("line-height", "normal")
    .css("margin", 0)
    .css("padding", 0)
}

export function swapXY({ x, y }: XY): XY {
  return { x: y, y: x }
}

// transposition accessors
export function nodeX(d: IProofTreeNode): number {
  return d.y
}

export function nodeY(d: IProofTreeNode): number {
  return d.x
}

// function goalNodeUnicityRepr(node: IGoalNode): string {
//   debugger
//   /*
//   retur  JSON.stringify({
//     "goalTerm": node.goalTerm,
//     "hyps": _(node.hyps)
//       .map(function(h) {
//         return {
//           "hName": h.hName,
//           "hValue": h.hValue,
//           "hType": h.hType,
//         }
//       })
//       .value(),
//   })
//   */
// }

// function tacticUnicityRepr(node: ITactic): string {
//   return JSON.stringify(
//     _(node.goals)
//       .map(goalNodeUnicityRepr)
//       .value()
//   )
// }

const centerLeftOffset = +10

const centerRightOffset = -10

function mkCenterLeft(x: number, y: number, h: number): XY {
  return { x: x + centerLeftOffset, y: y + h / 2 }
}

export function currentCenterLeft(d: IProofTreeNode): XY {
  return mkCenterLeft(d.currentScaledX, d.currentScaledY, d.getHeight())
}

export function destinationCenterLeft(d: IProofTreeNode): XY {
  return mkCenterLeft(d.getDestinationScaledX(), d.getDestinationScaledY(), d.getHeight())
}

function mkCenterRight(x: number, y: number, w: number, h: number): XY {
  return { x: x + w + centerRightOffset, y: y + h / 2 }
}

export function currentCenterRight(d: IProofTreeNode): XY {
  return mkCenterRight(d.currentScaledX, d.currentScaledY, d.getWidth(), d.getHeight())
}

export function destinationCenterRight(d: IProofTreeNode): XY {
  return mkCenterRight(d.getDestinationScaledX(), d.getDestinationScaledY(), d.getWidth(), d.getHeight())
}

/*
Right now this code doesn't make sense anymore, even type-wise the last
lines return an object of lists. Disabled for now.
*/

/*
  This might be terrible design, but [spotTheDifference] currently marks inline
  diffs through CSS background-color. It's much more stable than using
  rectangles when animated.
 */
// function spotTheDifferences(before: JQuery, after: JQuery) {
//
//   function rec(before, after) {
//
//     const nbBefore = before.children().length
//     const nbAfter = after.children().length
//     if (nbBefore !== nbAfter) {
//       return [{
//         "removed": before,
//         "added": after,
//       }]
//     }
//
//     const nbChildren = nbBefore
//     if (nbChildren === 0) { // both leaves
//       if (before.html() !== after.html()) {
//         return [{
//           "removed": before,
//           "added": after,
//         }]
//       } else {
//         return [];
//       }
//     }
//
//     const everyChildChanged = true
//
//     const childrenChanges = _.range(nbChildren).reduce(function(acc, i) {
//       const tmp = rec($(before.children()[i]), $(after.children()[i]))
//       if (tmp.length === 0) { everyChildChanged = false; }
//       return acc.concat(tmp)
//     }, [])
//       
//
//     if (everyChildChanged) {
//       return [{
//         "removed": before,
//         "added": after,
//       }]
//     } else {
//       return childrenChanges
//     }
//
//   }
//
//   const removed = []
//   const added = []
//
//   _(rec($(before).children(), $(after).children())).each(function(pair, ndx) {
//     pair.removed.css("background-color", diffColor(ndx))
//     pair.added.css("background-color", diffColor(ndx))
//     //removed.push(pair.removed)
//     //added.push(pair.added)
//   })
//
//   return { "removed": removed, "added": added }
// }

/*
  creates an empty rectangle in the same column as [node], at vertical position
  [currentY]
*/
function destinationEmptyRect(node: IProofTreeNode, currentY: number): Rectangle {
  const delta = 1 // how big to make the empty rectangle
  return $.extend(
    {
      "left": node.getDestinationScaledX(),
      "right": node.getDestinationScaledX() + node.getWidth(),
      "width": node.getWidth()
    },
    {
      "top": currentY - delta,
      "bottom": currentY + delta,
      "height": 2 * delta,
    }
  )
}

function currentEmptyRect(node: IProofTreeNode, currentY: number): Rectangle {
  const delta = 1 // how big to make the empty rectangle
  return $.extend(
    {
      "left": node.currentScaledX,
      "right": node.currentScaledY + node.getWidth(),
      "width": node.getWidth()
    },
    {
      "top": currentY - delta,
      "bottom": currentY + delta,
      "height": 2 * delta,
    }
  )
}

export function commonAncestor(n1: IProofTreeNode, n2: IProofTreeNode): IProofTreeNode {
  return n1.getParent().caseOf({
    nothing: () => n1,
    just: (n1p) => n2.getParent().caseOf({
      nothing: () => n2,
      just: (n2p) => {
        if (n1.id === n2.id) { return n1 }
        if (n1.depth < n2.depth) {
          return commonAncestor(n1, n2p)
        } else if (n1.depth > n2.depth) {
          return commonAncestor(n1p, n2)
        } else {
          return commonAncestor(n1p, n2p)
        }
      }
    })
  })
}

const diffColor = (() => {
  const colors = [
    "#ffbb78",
    "#f7b6d2",
    "#dbdb8d",
    "#6b6ecf",
    "#8ca252",
    "#b5cf6b",
    "#cedb9c",
    "#bd9e39",
    "#d6616b",
    "#ce6dbd",
    "#de9ed6",
  ]
  return d3Scale.scaleOrdinal<number, string>(colors)
})()
