import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in list">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ i + 1 }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                            <button @click="selected = i">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <hr>
                    <h1>🌀 AVEDL Submission Requirements</h1>
<p><strong>All Verified Extreme Demons List (AVEDL)</strong> includes every verified Extreme Demon in Geometry Dash — including unrated levels and challenge-style extremes. If a level or record isn’t yet on the list, please submit it using the appropriate Google Form.</p>

<hr>

<h2>🔹 1. Submitting a New Level</h2>
<p>If an Extreme Demon is <strong>not yet listed on AVEDL</strong>, you may submit it for review. Please ensure your submission meets the following requirements:</p>

<h3>✅ Level Requirements</h3>
<ul>
  <li><strong>Difficulty:</strong> Must clearly qualify as an <strong>Extreme Demon</strong>.</li>
  <li><strong>Verification:</strong> Must be legitimately verified (no hacks, noclip, or tool-assisted verification).</li>
  <li><strong>Verifier Identification:</strong> Provide the verifier’s in-game name and YouTube channel (if available).</li>
  <li><strong>Release Status:</strong> The level must be publicly accessible (published or uploaded as a copy).</li>
  <li><strong>Visibility:</strong> Unrated levels and private uploads are allowed, as long as verifier proof is available.</li>
</ul>

<h3>📝 Submission Form Details</h3>
<p>Please include the following information:</p>
<ol>
  <li>Level Name</li>
  <li>Creator(s)</li>
  <li>Verifier</li>
  <li>Verification Video Link (YouTube, Twitch VOD, or other verifiable source)</li>
  <li>Level ID</li>
  <li>Copy Password (if available)</li>
  <li>Any Notes (e.g., collab info, remake, buffed/nerfed version)</li>
</ol>

<h3>⚠️ Verification Proof Guidelines</h3>
<ul>
  <li>The verification video must show the entire attempt from the level’s start to finish.</li>
  <li>No cuts, speed changes, or suspicious transitions are allowed.</li>
  <li>FPS bypass is allowed up to 360 FPS.</li>
  <li>Practice Mode completions do <strong>not</strong> count as verifications.</li>
  <li>If the verifier is not the creator, make sure permission and credit are properly attributed.</li>
</ul>

<hr>

<h2>🔹 2. Submitting a Record on an Existing Level</h2>
<p>If you’ve beaten an Extreme Demon already on the AVEDL, you can submit your record for placement.</p>

<h3>✅ Record Requirements</h3>
<ul>
  <li>Record must be a <strong>at least the Qualifying Percentage</strong> of the level.</li>
  <li>Legitimacy: Must be achieved without hacks, speed hacks, or macro abuse.</li>
  <li><strong>Video Proof:</strong>
    <ul>
      <li>Complete, unedited video of the run is required.</li>
      <li>FPS counter must be visible or verifiable through game overlay.</li>
      <li>If using a modded client (e.g., MegaHack), ensure that no banned features were enabled.</li>
      <li>Allowed FPS: up to 360 FPS. Anything higher requires proof it does not affect gameplay balance.</li>
    </ul>
  </li>
</ul>

<h3>📝 Submission Form Details</h3>
<ol>
  <li>Player Name</li>
  <li>Level Name</li>
  <li>Completion Percentage (100%)</li>
  <li>Video Link (YouTube or other trusted platform)</li>
  <li>Raw Footage Link (if available)</li>
  <li>FPS Used</li>
  <li>Additional Notes (e.g., platform, input method)</li>
</ol>

<h3>⚠️ Additional Rules</h3>
<ul>
  <li>Records on copies are accepted only if the copy is identical to the official version.</li>
  <li>Edited or spliced footage will result in rejection.</li>
  <li>AVEDL staff may request additional proof or conduct re-verification if legitimacy is uncertain.</li>
</ul>

<hr>

<h2>🔹 3. Important Notes</h2>
<ul>
  <li>Submissions are reviewed by AVEDL moderators for difficulty validation and legitimacy.</li>
  <li>All accepted submissions are added to the official list with proper credit.</li>
  <li>False or fraudulent submissions will result in a ban from future submissions.</li>
</ul>

                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
    },
};
