import { NormalizedLandmark } from "@mediapipe/pose";

// Basic Euclidean distance between two points
function getDistance(p1: NormalizedLandmark, p2: NormalizedLandmark): number {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

// Calculate angle between three points (a, b, c) where b is the vertex
function getAngle(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark): number {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360.0 - angle;
    return angle;
}

interface FeedbackResult {
    score: number;
    message: string;
}

// Simple rule-based evaluator for a "T-Pose" or "Squat" (Example)
// In a real app, this would compare against a loaded JSON sequence of landmarks.
export function evaluatePose(landmarks: NormalizedLandmark[]): FeedbackResult {
    if (!landmarks || landmarks.length < 33) {
        return { score: 0, message: "No pose detected" };
    }

    // Example: Check for "Warrior II" stance rough approximation
    // Left arm straight out, Right arm straight out
    // Legs wide apart, one bent.

    // Let's implement a simpler "Arms Up" check for demo purposes
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];

    // Calculate arm angles
    const leftArmAngle = getAngle(leftShoulder, leftElbow, leftWrist);
    const rightArmAngle = getAngle(rightShoulder, rightElbow, rightWrist);

    // Check if arms are straight (angle near 180)
    const isLeftArmStraight = leftArmAngle > 160;
    const isRightArmStraight = rightArmAngle > 160;

    // Check if wrists are above shoulders
    const armsRaised = leftWrist.y < leftShoulder.y && rightWrist.y < rightShoulder.y;

    if (armsRaised && isLeftArmStraight && isRightArmStraight) {
        return { score: 95, message: "Perfect Form! Arms high and straight." };
    } else if (armsRaised) {
        return { score: 70, message: "Straighten your elbows!" };
    } else {
        return { score: 20, message: "Raise your arms!" };
    }
}

// Comparison against a reference (The "Shadow")
export function comparePoses(userLandmarks: NormalizedLandmark[], referenceLandmarks: NormalizedLandmark[]): FeedbackResult {
    // Average distance of key joints
    let totalDist = 0;
    const keyJoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]; // Shoulders, Elbows, Wrists, Hips, Knees, Ankles

    keyJoints.forEach(index => {
        totalDist += getDistance(userLandmarks[index], referenceLandmarks[index]);
    });

    const avgDist = totalDist / keyJoints.length;

    // Normalize score: 0 dist = 100 score. 0.5 dist = 0 score approximately.
    const score = Math.max(0, Math.min(100, 100 - (avgDist * 200)));

    let message = "Good match";
    if (score > 85) message = "Excellent synchronization!";
    else if (score > 60) message = "Good, keep alinged.";
    else if (score > 40) message = "Watch your alignment.";
    else message = "You're out of sync!";

    return { score: Math.round(score), message };
}
