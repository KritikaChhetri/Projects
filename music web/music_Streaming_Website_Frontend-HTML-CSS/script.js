document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    const playPauseButton = document.querySelector('.play-pause i');
    const musicInfoSongName = document.querySelector('.music-info-song-name b');
    const musicInfoArtist = document.querySelector('.music-info-sub');
    const currentTimeDisplay = document.querySelector('.music-bar p:first-child');
    const durationDisplay = document.querySelector('.music-bar p:last-child');
    const songProgressBar = document.querySelector('.song-bar input');
    const volumeBar = document.querySelector('.volume-bar input');

    // Music sources mapped to images
    const musicSources = {
        'src/Believer_cover.jpg': { 
            src: 'mp3/Believer.mp3', 
            name: 'Believer', 
            artist: 'Imagine Dragons' 
        },
        'src/Champion_cover.jpeg': { 
            src: 'mp3/Dwayne_DJ_Bravo -Champion.mp3', 
            name: 'Champion', 
            artist: 'Dwayne Bravo' 
        },
        'src/maroon5_cover.png': { 
            src: 'mp3/Maroon5.mp3', 
            name: 'Moves Like Jagger', 
            artist: 'Maroon 5' 
        }
    };

    // Add click event to featured article images
    document.querySelectorAll('.article-featured .article-image img').forEach(img => {
        img.addEventListener('click', () => {
            const musicSource = musicSources[img.getAttribute('src')];
            if (musicSource) {
                audioPlayer.src = musicSource.src;
                musicInfoSongName.textContent = musicSource.name;
                musicInfoArtist.textContent = musicSource.artist;
                audioPlayer.play();
                playPauseButton.classList.remove('fa-play');
                playPauseButton.classList.add('fa-pause');
            }
        });
    });

    // Play/Pause functionality
    playPauseButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.classList.remove('fa-play');
            playPauseButton.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            playPauseButton.classList.remove('fa-pause');
            playPauseButton.classList.add('fa-play');
        }
    });


    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        
        // Format time
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);

        // Update progress bar
        songProgressBar.value = (currentTime / duration) * 100;
    });

    // Seek functionality
    songProgressBar.addEventListener('input', () => {
        const time = (songProgressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
    });

    // Volume control
    volumeBar.addEventListener('input', () => {
        audioPlayer.volume = volumeBar.value / 100;
    });

    // Previous and Next buttons (basic implementation)
    const prevButton = document.querySelector('.fa-step-backward');
    const nextButton = document.querySelector('.fa-step-forward');
    
    const musicSourcesArray = Object.values(musicSources);
    let currentMusicIndex = 0;

    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentMusicIndex = (currentMusicIndex - 1 + musicSourcesArray.length) % musicSourcesArray.length;
        const musicSource = musicSourcesArray[currentMusicIndex];
        audioPlayer.src = musicSource.src;
        musicInfoSongName.textContent = musicSource.name;
        musicInfoArtist.textContent = musicSource.artist;
        audioPlayer.play();
        playPauseButton.classList.remove('fa-play');
        playPauseButton.classList.add('fa-pause');
    });

    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentMusicIndex = (currentMusicIndex + 1) % musicSourcesArray.length;
        const musicSource = musicSourcesArray[currentMusicIndex];
        audioPlayer.src = musicSource.src;
        musicInfoSongName.textContent = musicSource.name;
        musicInfoArtist.textContent = musicSource.artist;
        audioPlayer.play();
        playPauseButton.classList.remove('fa-play');
        playPauseButton.classList.add('fa-pause');
    });
});