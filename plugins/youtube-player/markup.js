export default function(config) {
    return `<div class="${config.cssClasses.wrapper}">
        <div class="${config.cssClasses.wrapperInner}">
            <div id="${config.videoId}" class="${config.cssClasses.video}"></div>
            <div class="${config.cssClasses.cover}">
                <div class="${config.cssClasses.icons}">
                    <div class="${config.cssClasses.playButtonWrapper}">
                        ${config.playIcon}
                    </div>
                    <div class="${config.cssClasses.spinnerWrapper}">
                        ${config.spinnerIcon}
                    </div>
                </div>
                <p class="${config.cssClasses.customText}">
                    ${config.customText}
                </p>
            </div>
        </div>
    </div>`;
}
