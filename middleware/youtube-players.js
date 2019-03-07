/**
 * Middleware needs to be added to clear the YTPlayers
 * array on the window object on route change
 */
export default () => {
    if (typeof window !== 'undefined') {
        window.YTPlayers = []
    }
}