<template>
  <transition
    @enter="scoreboardEnter"
    @leave="scoreboardLeave"
    @before-enter="beforeScoreboardEnter"
  >
    <div
      v-if="activeRoundStore.scoreboardData.isVisible"
      class="scoreboard-wrapper"
    >
      <div class="scoreboard-teams">
        <div class="scoreboard-team-layout">
          <div class="team-display-wrapper" :style="{}">
            <div
              class="team-display team-alpha"
              :style="{
                border: '1px solid #ffffff88',
                borderRadius: '4px',
                color: '#ffffff',
              }"
            >
              <opacity-swap-transition>
                <div class="team-name">
                  <div
                    :style="{
                      display: 'flex',
                      marginTop: '6pt',
                      marginBottom: '4pt',
                    }"
                  >
                    <div
                      :style="{
                        width: '14pt',
                        marginRight: '4pt',
                        backgroundColor: teamA?.color,
                        border: '1px white solid',
                      }"
                    ></div>
                    <div
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4pt',
                      }"
                    >
                      <div
                        :style="{
                          flex: 1,
                          border: '1px white solid',
                          backgroundColor:
                            teamA?.score >= 1 ? teamA?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                      <div
                        :style="{
                          flex: 1,
                          border: '1px white solid',
                          backgroundColor:
                            teamA?.score >= 2 ? teamA?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                      <div
                        :style="{
                          display: games.length > 3 ? 'block' : 'none',
                          flex: 1,
                          flexShrink: 0,
                          border: '1px white solid',
                          backgroundColor:
                            teamA?.score >= 3 ? teamA?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                    </div>
                    <div
                      :style="{
                        marginTop: '6pt',
                        marginLeft: '6pt',
                        marginRight: '6pt',
                        flexShrink: 0,
                      }"
                    >
                      <img
                        :src="teamAFlag"
                        :style="{
                          height: '50px',
                        }"
                      />
                    </div>
                    <fitted-content
                      :key="teamAName"
                      :max-width="203"
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingTop: '6pt',
                        paddingBottom: '6pt',
                        gap: '2pt',
                        flexShrink: 1,
                        justifyContent: 'center',
                      }"
                    >
                      <div
                        :style="{
                          flexShrink: 1,
                          fontSize: '24pt',
                          fontFamily: 'Anton',
                          fontWeight: 400,
                          lineHeight: 1,
                          textTransform: 'uppercase',
                        }"
                      >
                        {{ teamAName }}
                      </div>
                      <div
                        :style="{
                          flexShrink: 1,
                          fontSize: '12pt',
                          fontWeight: 300,
                          lineHeight: 1,
                          fontFamily: 'Blinker',
                        }"
                      >
                        {{ teamASeed }}
                      </div>
                    </fitted-content>
                  </div>
                </div>
              </opacity-swap-transition>
              <div class="score-color-wrapper">
                <div class="team-score">
                  <score-counter :value="teamA?.score" />
                </div>
              </div>
            </div>
          </div>
          <div class="separator" />
          <div class="team-display-wrapper" :style="{}">
            <div
              class="team-display team-bravo"
              :style="{
                border: '1px solid #ffffff88',
                borderRadius: '4px',
                color: '#ffffff',
              }"
            >
              <opacity-swap-transition>
                <div class="team-name">
                  <div
                    :style="{
                      display: 'flex',
                      marginTop: '6pt',
                      marginBottom: '4pt',
                    }"
                  >
                    <div
                      :style="{
                        width: '14pt',
                        marginRight: '4pt',
                        backgroundColor: teamB?.color,
                        border: '1px white solid',
                      }"
                    ></div>
                    <div
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4pt',
                      }"
                    >
                      <div
                        :style="{
                          flex: 1,
                          border: '1px white solid',
                          backgroundColor:
                            teamB?.score >= 1 ? teamB?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                      <div
                        :style="{
                          flex: 1,
                          border: '1px white solid',
                          backgroundColor:
                            teamB?.score >= 2 ? teamB?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                      <div
                        :style="{
                          display: games.length > 3 ? 'block' : 'none',
                          flex: 1,
                          flexShrink: 0,
                          border: '1px white solid',
                          backgroundColor:
                            teamB?.score >= 3 ? teamB?.color : 'transparent',
                          width: '12pt',
                          marginRight: '4pt',
                        }"
                      ></div>
                    </div>
                    <div
                      :style="{
                        marginTop: '6pt',
                        marginLeft: '6pt',
                        marginRight: '6pt',
                        flexShrink: 0,
                      }"
                    >
                      <img
                        :src="teamBFlag"
                        :style="{
                          height: '50px',
                        }"
                      />
                    </div>
                    <fitted-content
                      :key="teamBName"
                      :max-width="203"
                      :style="{
                        display: 'flex',
                        flexDirection: 'column',
                        paddingTop: '6pt',
                        paddingBottom: '6pt',
                        gap: '2pt',
                        flexShrink: 1,
                        justifyContent: 'center',
                      }"
                    >
                      <div
                        :style="{
                          flexShrink: 1,
                          fontSize: '24pt',
                          fontFamily: 'Anton',
                          fontWeight: 400,
                          lineHeight: 1,
                          textTransform: 'uppercase',
                        }"
                      >
                        {{ teamBName }}
                      </div>
                      <div
                        :style="{
                          flexShrink: 1,
                          fontSize: '12pt',
                          fontWeight: 300,
                          lineHeight: 1,
                          fontFamily: 'Blinker',
                        }"
                      >
                        {{ teamBSeed }}
                      </div>
                    </fitted-content>
                  </div>
                </div>
              </opacity-swap-transition>
              <div class="score-color-wrapper">
                <div class="team-score">
                  <score-counter :value="teamB?.score" />
                </div>
              </div>
            </div>
          </div>
          <div class="scoreboard-extra">
            <event-logo class="event-logo" />
            <div
              class="flavor-text-wrapper"
              :style="{
                flex: 1,
              }"
            >
              <opacity-swap-transition>
                <fitted-content
                  :key="scoreExtra"
                  class="flavor-text"
                  :max-width="339"
                  align="center"
                >
                  {{ scoreExtra }}
                </fitted-content>
              </opacity-swap-transition>
            </div>
          </div>
        </div>
      </div>
      <div class="scoreboard-prebar">
        <video
          id="scoreboard-prebar-video"
          src="../../assets/swsbar.webm"
          muted
        ></video>
      </div>
      <div class="scoreboard-bar">
        <div class="flag">
          <img :src="teamAFlag" />
        </div>
        <fitted-content
          :key="teamAName"
          :max-width="483"
          class="team"
          align="center"
          >{{ teamAName }}
        </fitted-content>
        <div
          class="score"
          :style="{
            backgroundColor: teamA?.color,
            color: getContrastingTextColor(teamA?.color, 'white', 'black'),
          }"
        >
          {{ teamA?.score }}
          <div>
            <div
              :style="{
                border: `1px ${getContrastingTextColor(teamA?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamA?.score >= 1
                    ? getContrastingTextColor(teamA?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
            <div
              :style="{
                border: `1px ${getContrastingTextColor(teamA?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamA?.score >= 2
                    ? getContrastingTextColor(teamA?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
            <div
              :style="{
                display: games.length > 3 ? 'block' : 'none',
                border: `1px ${getContrastingTextColor(teamA?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamA?.score >= 3
                    ? getContrastingTextColor(teamA?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
          </div>
        </div>

        <div class="main">
          <fitted-content
            :max-width="452"
            align="center"
            :key="barMain"
            class="bolder"
          >
            {{ barMain }}
          </fitted-content>
          <fitted-content :max-width="452" align="center" :key="barMainSub">
            {{ barMainSub }}
          </fitted-content>
        </div>

        <div
          class="score"
          :style="{
            backgroundColor: teamB?.color,
            color: getContrastingTextColor(teamB?.color, 'white', 'black'),
          }"
        >
          {{ teamB?.score }}
          <div>
            <div
              :style="{
                border: `1px ${getContrastingTextColor(teamB?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamB?.score >= 1
                    ? getContrastingTextColor(teamB?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
            <div
              :style="{
                border: `1px ${getContrastingTextColor(teamB?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamB?.score >= 2
                    ? getContrastingTextColor(teamB?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
            <div
              :style="{
                display: games.length > 3 ? 'block' : 'none',
                border: `1px ${getContrastingTextColor(teamB?.color, 'white', 'black')} solid`,
                backgroundColor:
                  teamB?.score >= 3
                    ? getContrastingTextColor(teamB?.color, 'white', 'black')
                    : 'transparent',
              }"
            ></div>
          </div>
        </div>
        <fitted-content
          :key="teamBName"
          :max-width="483"
          class="team team-invert"
          align="center"
          >{{ teamBName }}
        </fitted-content>
        <div class="flag">
          <img :src="teamBFlag" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FittedContent from "../../components/FittedContent.vue";
import { computed } from "vue";
import OpacitySwapTransition from "../../components/OpacitySwapTransition.vue";
import { addDots } from "browser-shared/helpers/StringHelper";
import gsap from "gsap";
import { useActiveRoundStore } from "browser-shared/stores/ActiveRoundStore";
import { getContrastingTextColor } from "../../helpers/ColorHelper";
import ScoreCounter from "components/ScoreCounter.vue";
import EventLogo from "components/EventLogo.vue";

export default defineComponent({
  name: "GameplayScoreboard",

  components: { EventLogo, ScoreCounter, OpacitySwapTransition, FittedContent },

  setup() {
    const activeRoundStore = useActiveRoundStore();
    const teamA = computed(() => activeRoundStore.activeRound.teamA);
    const teamB = computed(() => activeRoundStore.activeRound.teamB);
    const teamAName = computed(() =>
      teamA.value.name === "The Invincible Fleet Rei Maru"
        ? addDots("Invincible Fleet")
        : addDots(teamA.value.name)
    );
    const teamBName = computed(() =>
      teamB.value.name === "The Invincible Fleet Rei Maru"
        ? addDots("Invincible Fleet")
        : addDots(teamB.value.name)
    );
    const games = computed(() => activeRoundStore.activeRound.games);
    const match = computed(() => activeRoundStore.activeRound.match);

    const barMain = computed(() => {
      return `${activeRoundStore.activeRound.match.name} • Best of ${activeRoundStore.activeRound.games.length}`;
    });
    const nextPickingTeam = computed(() => {
      if (activeRoundStore.scoreSum === 0) return "alpha";
      const lastWinner =
        activeRoundStore.activeRound.games[activeRoundStore.scoreSum - 1]
          .winner;
      if (lastWinner === "none") return "alpha";
      return lastWinner === "bravo" ? "alpha" : "bravo";
    });

    const barMainSub = computed(() => {
      return `${
        activeRoundStore.activeRound.games[
          activeRoundStore.activeRound.games.findIndex(
            (game) => game.winner === "none"
          )
        ]?.stage
      } • ${nextPickingTeam.value === "alpha" ? teamAName.value : teamBName.value}'s pick`;
    });

    const scoreExtra = computed(() => {
      return `${barMain.value} • ${nextPickingTeam.value === "alpha" ? teamAName.value : teamBName.value}'s pick`;
    });

    const flags = {
      jp: "https://iili.io/F8x2Db9.png",
      us: "https://iili.io/F8x2mxe.png",
      eu: "https://iili.io/F8x2pWu.png",
      es: "https://iili.io/F8x2yib.png",
    } as const;

    const teamFlags = {
      "38001": "jp",
      "37375": "jp",
      "39243": "jp",
      "37135": "jp",
      "36331": "jp",
      "39244": "jp",
      "38264": "jp",
      "39169": "jp",
      "37584": "es",
      "36985": "us",
      "38715": "us",
      "38469": "us",
      "36850": "us",
      "37843": "us",
      "39455": "eu",
      "39435": "eu",
    } as const;

    const seeds = {
      "38001": "Seed 1 • AREA CUP Invitee #1",
      "37584": "Seed 2 • SuperJump 5 #1",
      "37375": "Seed 3 • AREA CUP Invitee #2",
      "36985": "Seed 4 • SuperJump 5 #2",
      "39243": "Seed 5 • AREA CUP Invitee #3",
      "38715": "Seed 6 • SWS Qualifier 1 [W]",
      "37135": "Seed 7 • AREA CUP Invitee #4",
      "38469": "Seed 8 • SWS Qualifier 1 [L]",
      "36331": "Seed 9 • AREA CUP Invitee #5",
      "36850": "Seed 10 • SuperJump 5 #4",
      "39244": "Seed 11 • AREA CUP Invitee #6",
      "39435": "Seed 12 • SWS Qualifier 2 [W]",
      "38264": "Seed 13 • AREA CUP Invitee #7",
      "39455": "Seed 14 • SWS Qualifier 2 [L]",
      "39169": "Seed 15 • AREA CUP Invitee #8",
      "37843": "Seed 16 • SuperJump 5 #T-5 ",
    } as const;

    return {
      teamA,
      teamB,
      match,
      barMain,
      scoreExtra,
      barMainSub,
      teamAName,
      teamBName,
      games,
      teamASeed: computed(() => {
        return seeds[teamA.value.id as keyof typeof seeds];
      }),
      teamBSeed: computed(() => {
        return seeds[teamB.value.id as keyof typeof seeds];
      }),
      teamAFlag: computed(
        () =>
          flags[
            teamFlags[
              teamA.value.id as keyof typeof teamFlags
            ] as keyof typeof flags
          ]
      ),
      teamBFlag: computed(
        () =>
          flags[
            teamFlags[
              teamB.value.id as keyof typeof teamFlags
            ] as keyof typeof flags
          ]
      ),
      activeRoundStore,
      scoreboardEnter: (elem: HTMLElement, done: gsap.Callback) => {
        const video = document.getElementById(
          "scoreboard-prebar-video"
        ) as HTMLVideoElement;
        video.currentTime = 0;
        video.play();
        const tl = gsap.timeline({ onComplete: done });
        tl.to(elem.querySelectorAll(".scoreboard-bar"), {
          y: 20,
          opacity: 0,
          duration: 0.5,
          delay: 13,
          stagger: -0.1,
          ease: "power4.out",
        }).to(
          elem.querySelectorAll(".team-display-wrapper, .scoreboard-extra"),
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: -0.1,
            ease: "power4.out",
          }
        );
      },
      beforeScoreboardEnter: (elem: HTMLElement) => {
        gsap.set(
          elem.querySelectorAll(".team-display-wrapper, .scoreboard-extra"),
          { opacity: 0, y: -25 }
        );
      },
      scoreboardLeave: (elem: HTMLElement, done: gsap.Callback) => {
        const tl = gsap.timeline({ onComplete: done });
        tl.to(
          elem.querySelectorAll(".team-display-wrapper, .scoreboard-extra"),
          {
            y: 25,
            opacity: 0,
            duration: 0.5,
            stagger: -0.1,
            ease: "power4.in",
          }
        );
      },
      getContrastingTextColor,
    };
  },
});
</script>

<style lang="scss">
@use "sass:color";
@use "../../styles/constants";
@use "../../styles/font-mixins";

.scoreboard-wrapper {
  > .scoreboard-prebar {
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  > .scoreboard-bar {
    position: absolute;
    font-family: Anton;
    bottom: 32px;
    left: 32px;
    right: 32px;
    height: 112px;
    background-color: #10011b;
    font-size: 56px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: white;
    display: flex;

    > .main {
      font-family: Blinker;
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-left: 8px;
      padding-right: 8px;
      > .bolder {
        font-size: 40px;
        line-height: 1;
        font-weight: 600;
      }
      > div {
        line-height: 1;
        font-size: 26px;
        font-weight: 400;
      }
    }

    > .flag {
      flex-shrink: 0;
      background-image: linear-gradient(to right, #cf65b4, #9b2abf);
      padding-top: 24px;
      padding-bottom: 24px;
      padding-left: 16px;
      padding-right: 16px;
      height: 100%;
      > img {
        height: 100%;
      }
    }

    > .team {
      flex-shrink: 0;
      text-align: center;
      display: flex;
      overflow: hidden;
      justify-content: center;
      align-items: center;
      width: 100%;
      max-width: 483px;
      text-transform: uppercase;
      background-image: url("../../assets/pattern-halftone-top_2_1.png");
      background-position: 50px 5px;
      background-repeat: no-repeat;
    }
    .team-invert {
      background-image: url("../../assets/pattern-halftone-top_2_2.png");
      background-position: -50px 5px;
    }

    > .score {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 64px;
      width: 83px;
      > div {
        display: flex;
        width: 83px;
        gap: 4px;
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 4px;
        > div {
          height: 12px;
          flex: 1;
          width: 100%;
        }
      }
    }
  }

  > .scoreboard-teams {
    position: absolute;
    top: 30px;
    left: 30px;
    height: 170px;

    > .scoreboard-team-layout {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      z-index: 2;
      width: 100%;

      .team-display {
        background-color: #10011b;
        display: flex;
        align-items: stretch;
        height: 100%;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
        transition: background-color 350ms;
        transform-origin: center left;
        position: relative;
        width: 100%;

        &:before {
          content: "";
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          position: absolute;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.2) 100%
          );
          mix-blend-mode: multiply;
        }

        .score-color-wrapper {
          font-family: Anton;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #21102d;

          > .team-score {
            color: #fff;
            font-size: 42px;
            min-width: 60px;
            overflow: hidden;
          }
        }

        > .team-name {
          @include font-mixins.font-barlow-condensed;

          margin: 0 8px;
          z-index: 999;
          transform: translateY(-2px);
          transition: color 350ms;
          width: 340px;
          flex: 1 1 0%;
          font-size: 40px;
          font-weight: 600;

          > div {
            > div {
              > div {
                flex: none;
              }
            }
          }
        }
      }
    }
  }

  .scoreboard-extra {
    @include font-mixins.font-barlow-condensed;

    margin-top: 6pt;
    width: 100%;
    background-color: #10011b;
    color: #fff;
    border: 1px solid #ffffff88;
    border-radius: 4px;
    color: #ffffff;
    font-size: 18px;
    display: flex;
    align-items: center;
    padding: 6pt;
    gap: 6pt;

    .event-logo {
      color: #fff;
      height: 16pt;
    }

    > .tournament-logo {
      width: 75px;
      margin-left: 4px;
      margin-top: 12px;
    }

    > .flavor-text-wrapper {
      flex: 1 1 0%;
    }
  }
}
</style>
