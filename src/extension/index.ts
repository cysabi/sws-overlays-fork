import type NodeCG from '@nodecg/types';

export = (nodecg: NodeCG.ServerAPI): void => {

    // @ts-ignore: i don't want to deal with it
    nodecg.extensions['ipl-overlay-controls'].bundleConfigDeclarationService.declareCasterSets(nodecg.bundleName, [
        {
            key: 'preshow',
            maxItems: 4,
            names: {
                EN: 'Preshow'
            }
        }
    ]);
}
