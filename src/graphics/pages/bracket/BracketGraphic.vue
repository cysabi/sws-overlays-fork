<template>
    <div
        ref="wrapper"
        class="bracket-wrapper"
    />
    <maze-background />
</template>

<script setup lang="ts">
import { BracketRenderer } from '@tourneyview/renderer';
import { Match } from '@tourneyview/common';
import { onMounted, useTemplateRef, watch } from 'vue';
import { D3BracketAnimator } from '@tourneyview/renderer';
import type { HierarchyNode } from 'd3';
import { useBracketStore } from 'browser-shared/stores/BracketStore';
import MazeBackground from 'components/MazeBackground.vue';
import * as d3 from 'd3';

const wrapper = useTemplateRef('wrapper');
const bracketStore = useBracketStore();
const renderer = new BracketRenderer({
    animator: new D3BracketAnimator(),
    eliminationOpts: {
        onCellCreation: (elem) => {
            elem
                .selectAll('.match-cell__team-name')
                .each(function (datum: HierarchyNode<Match>) {
                    const seedElement = document.createElement('div');
                    const team = (this as HTMLElement).classList.contains('match-cell__top-team-name')
                        ? 'top' : 'bottom';

                    seedElement.classList.add('match-cell__team-seed');
                    seedElement.classList.add(`match-cell__${team}-team-seed`);
                    seedElement.innerText = (team === 'top' ? datum.data.topTeam.seed : datum.data.bottomTeam.seed)?.toString() ?? '-';
                    (this as HTMLElement).parentNode?.insertBefore(seedElement, (this as HTMLElement));
                });

            elem.each(function() {
                const seedLineElem = document.createElement('div');
                seedLineElem.classList.add('line', 'team-seed');
                const teamNameLineElem = document.createElement('div');
                teamNameLineElem.classList.add('line', 'team-name');
                const scoreLineElem = document.createElement('div');
                scoreLineElem.classList.add('line', 'team-score');

                const matchCell = (this as HTMLElement).querySelector('.match-cell');
                const bottomTeamSeedElem = (this as HTMLElement).querySelector('.match-cell__bottom-team-seed');
                matchCell!.insertBefore(seedLineElem, bottomTeamSeedElem);
                matchCell!.insertBefore(teamNameLineElem, bottomTeamSeedElem);
                matchCell!.insertBefore(scoreLineElem, bottomTeamSeedElem);
            });
        },
        onCellUpdate: (elem) => {
            elem.selectAll('.match-cell__top-team-seed').text((datum: HierarchyNode<Match>) => datum.data.topTeam.seed ?? '-');
            elem.selectAll('.match-cell__bottom-team-seed').text((datum: HierarchyNode<Match>) => datum.data.bottomTeam.seed ?? '-');
        },
        curveFunction: d3.curveStep,
        bracketHeaderOffset: 16
    }
});

onMounted(async () => {
    wrapper.value!.appendChild(renderer.element);

    watch(() => bracketStore.bracketData, newValue => {
        if (newValue != null) {
            renderer.setData(newValue);
        }
    }, { immediate: true });
});
</script>

<style lang="scss">
body {
    height: 1080px !important;
}
</style>

<style lang="scss" scoped>
@use '../../styles/constants';

$margin: 100px;
$top-margin: 50px;
$bottom-margin: 50px;

// cheeky workaround to make these gradients animatable
@property --score-gradient-start {
    syntax: '<color>';
    initial-value: #E4E4E4;
    inherits: false;
}

@property --score-gradient-end {
    syntax: '<color>';
    initial-value: #E4E4E4;
    inherits: false;
}

@property --team-name-gradient-start {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
}

@property --team-name-gradient-end {
    syntax: '<color>';
    initial-value: transparent;
    inherits: false;
}

.bracket-wrapper {
    font-size: 0.6em;
    position: absolute;
    top: $top-margin;
    left: $margin;
    z-index: 3;
}

.bracket-wrapper :deep(> div) {
    width: 1920px - $margin * 2;
    height: 1080px - ($bottom-margin + $top-margin);
    overflow: visible;

    .swiss-renderer__wrapper {
        padding: 5px 0;
    }

    .elimination-renderer {
        .bracket-header {
            font-size: 1.75em;
        }

        .match-cell__third-place-match-label {
            box-sizing: border-box;
            font-size: 14px;
            grid-column: span 3;
            background-color: #0F0019;
        }

        .match-cell {
            grid-template-columns: 30px 1fr 35px;
            grid-template-rows: 1fr 1px 1fr;
            border-radius: 0;
            background-color: #E4E4E4;
            outline: 1px solid rgba(34, 34, 34, 0.25);

            &.has-third-place-match-label {
                grid-template-rows: auto 1fr 1px 1fr;
            }

            .line {
                width: 100%;
                height: 100%;

                &.team-seed {
                    background-color: #93869E;
                    border-color: #0F0019;
                    border-style: solid;
                    border-width: 0 4px;
                }

                &.team-name {
                    background-color: #C5C5C5;
                    border-color: #E4E4E4;
                    border-style: solid;
                    border-width: 0 8px;
                }
            }

            .match-cell__team-name {
                color: #000;
                font-weight: 600;
                font-size: 22px;
                line-height: 32px;
                height: 100%;
                margin-left: 0;
                padding-left: 5px;
                background: linear-gradient(to right, var(--team-name-gradient-start) 0%, var(--team-name-gradient-end) 100%);
                transition-property: --team-name-gradient-start, --team-name-gradient-end, color;
                transition-duration: 350ms;
            }

            .match-cell__team-seed {
                height: 100%;
                text-align: center;
                background-color: #0F0019;
                line-height: 30px;
                font-size: 20px;
            }

            .match-cell__score-wrapper {
                line-height: 1.7em;
                height: 100%;
            }

            .match-cell__score {
                font-weight: 700;
                height: 100%;
                font-size: 28px;
                line-height: 30px;
                color: #222;
                background: linear-gradient(to bottom, var(--score-gradient-start) 0%, var(--score-gradient-end) 100%);
                transition-property: --score-gradient-start, --score-gradient-end, color;
                transition-duration: 350ms;

                &.is-disqualified {
                    font-size: 1em;
                }
            }
        }

        .missing-team {
            .match-cell__score {
                --score-gradient-start: #636363;
                --score-gradient-end: #636363;
                color: #fff;
            }
        }

        .bottom-team-winner {
            .match-cell__bottom-team-name {
                --team-name-gradient-start: rgba(160, 47, 186, 0.25);
                --team-name-gradient-end: rgba(201, 105, 171, 0.15);
            }

            .match-cell__bottom-score {
                --score-gradient-start: #A02FBA;
                --score-gradient-end: #C969AB;
                color: white;
            }
        }

        .top-team-winner {
            .match-cell__top-team-name {
                --team-name-gradient-start: rgba(160, 47, 186, 0.25);
                --team-name-gradient-end: rgba(201, 105, 171, 0.15);
            }

            .match-cell__top-score {
                --score-gradient-start: #A02FBA;
                --score-gradient-end: #C969AB;
                color: white;
            }
        }

        .bracket-link {
            stroke: #767676;
            stroke-width: 1.5px;
        }
    }

    .swiss-renderer {
        width: 60%;
        justify-items: center;

        .match-row-wrapper {
            margin: 8px 0;
            width: 1000px;
            overflow: hidden;
            position: relative;
            display: flex;
            justify-content: center;
        }

        .match-row {
            background-color: transparent;
            width: 1000px;
            height: 100%;
            position: absolute;

            .match-row__team-name {
                font-size: 1.5em;
            }

            .match-row__scores {
                font-weight: 800;
                font-size: 1.1em;
                font-family: 'Montserrat', sans-serif;
                width: 100px;
                padding: 0 4px;
            }
        }
    }
}
</style>
