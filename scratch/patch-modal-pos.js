const fs = require('fs');

const path = 'c:/Projects/Portfolio builder/src/app/(dashboard)/dashboard/dashboard-client.tsx';
let content = fs.readFileSync(path, 'utf-8');

// The modal block starts with {/* Premium Flow Modal Overlay */}
// and ends with </AnimatePresence> just before </motion.div> for the interview tab.

const startMarker = '{/* Premium Flow Modal Overlay */}';
const endMarker = '</AnimatePresence>';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) throw new Error("Start marker not found");

// Find the end marker after the start marker
let endIndex = content.indexOf(endMarker, startIndex);
if (endIndex === -1) throw new Error("End marker not found");
endIndex += endMarker.length;

// Extract the block
let modalBlock = content.substring(startIndex, endIndex);

// Remove the block from original position
content = content.substring(0, startIndex) + content.substring(endIndex);

// Find the final closing </div>
const lastDivIndex = content.lastIndexOf('</div>');
if (lastDivIndex === -1) throw new Error("Could not find final </div>");

// Inject before the last </div>
content = content.substring(0, lastDivIndex) + '\n      ' + modalBlock + '\n    ' + content.substring(lastDivIndex);

fs.writeFileSync(path, content, 'utf-8');
console.log("Modal moved successfully!");
