import React from 'react';
import { withSvgDraw } from '../SvgDraw';
import {
    drawDot,
    drawSourceEdge,
    drawFileText,
    drawFileIcon,
    drawFolderText,
    drawFolderIcon
} from './drawHelpers';

import { FILE_NODE_TYPE, DIR_NODE_TYPE } from '../../store/constants';

class SourceTree extends React.Component {
    componentDidMount() {
        this.drawSet = this.props.primaryDraw.set();
        this.drawTree();
    }

    addToSet(list) {
        this.drawSet.add.apply(this.drawSet, [].concat(list));
    }

    componentDidUpdate() {
        this.clearPrimaryDraw();
        this.clearSecondaryDraw();

        this.drawTree();
    }

    componentWillUnmount() {
        this.clearPrimaryDraw();
    }

    clearPrimaryDraw() {
        this.drawSet.each(function() {
            //TODO: remove event listener here
            this.remove();
        });
    }

    clearSecondaryDraw() {
        this.props.secondaryDraw.clear();
    }

    drawTree() {
        const {
            primaryDraw,
            secondaryDraw,
            layoutNodes,
            shiftToCenterPoint,
            dependenciesDiagramOn
        } = this.props;

        const add = this.addToSet.bind(this);

        //note: instance from d3-flex tree, not Array
        layoutNodes.each(node => {
            const [nX, nY] = [node.y, node.x];
            const parent = node.parent;

            if (parent && parent.data.type === DIR_NODE_TYPE) {
                const [pX, pY] = [parent.y, parent.x];

                drawSourceEdge(secondaryDraw, shiftToCenterPoint, {
                    disabled: dependenciesDiagramOn,
                    target: {
                        x: nX,
                        y: nY
                    },
                    source: {
                        x: pX,
                        y: pY
                    },
                    singleChild: parent.children.length === 1
                });
            }

            if (node.data.type === FILE_NODE_TYPE) {
                drawDot(secondaryDraw, shiftToCenterPoint, {
                    x: nX,
                    y: nY,
                    disabled: dependenciesDiagramOn
                });

                add(
                    drawFileText(primaryDraw, shiftToCenterPoint, {
                        x: nX,
                        y: nY,
                        name: node.data.name
                    })
                );
                add(
                    drawFileIcon(primaryDraw, shiftToCenterPoint, {
                        x: nX,
                        y: nY,
                        onClick() {
                            console.log(node.data.name);
                        }
                    })
                );
                return;
            }

            if (node.data.type === DIR_NODE_TYPE) {
                drawDot(secondaryDraw, shiftToCenterPoint, {
                    x: nX,
                    y: nY,
                    disabled: dependenciesDiagramOn
                });

                add(
                    drawFolderText(primaryDraw, shiftToCenterPoint, {
                        x: nX,
                        y: nY,
                        name: node.data.name,
                        disabled: dependenciesDiagramOn
                    })
                );
                add(
                    drawFolderIcon(primaryDraw, shiftToCenterPoint, {
                        x: nX,
                        y: nY,
                        disabled: dependenciesDiagramOn,
                        onClick() {
                            console.log(node.data.name);
                        }
                    })
                );
            }
        });
    }

    render() {
        return null;
    }
}

export default withSvgDraw(SourceTree);
