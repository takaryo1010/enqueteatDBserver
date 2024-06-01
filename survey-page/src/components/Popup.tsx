const Popup: React.FC = () => {
        
        return (
                <div>
                        <button id="showPopup">ポップアップを表示</button>
                        <div id="popup" style={{ display: 'none' }}>
                                これはシンプルなポップアップです。
                        </div>
                        <script src="app.ts"></script>
                </div>
        );
};

export { Popup};
