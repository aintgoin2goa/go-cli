/**
 * Pipe Streams
 *
 * pipe second stream in the first stream.
 *
 * @returns {Streams}
 */
const pipeStreams = (
    streamA,
    streamB
) => {
    if (!streamA || !streamA.pipe || !streamB) {
        return null;
    }

    return streamA.pipe(streamB);
};

module.exports = pipeStreams;
