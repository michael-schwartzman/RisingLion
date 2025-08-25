import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate, WKUIDelegate {
    
    private var webView: WKWebView!
    private var activityIndicator: UIActivityIndicatorView!
    
    override func loadView() {
        // Configure WebView
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        webConfiguration.preferences.javaScriptEnabled = true
        
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.uiDelegate = self
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        
        view = webView
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupActivityIndicator()
        loadGame()
    }
    
    private func setupActivityIndicator() {
        activityIndicator = UIActivityIndicatorView(style: .large)
        activityIndicator.center = view.center
        activityIndicator.hidesWhenStopped = true
        view.addSubview(activityIndicator)
        activityIndicator.startAnimating()
    }
    
    private func loadGame() {
        // Load the game from your web server
        let gameURL = URL(string: "https://risinglion.schwartzman.org/rising-lion/")!
        let request = URLRequest(url: gameURL)
        webView.load(request)
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        activityIndicator.startAnimating()
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        activityIndicator.stopAnimating()
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showErrorAlert(error: error)
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        activityIndicator.stopAnimating()
        showErrorAlert(error: error)
    }
    
    private func showErrorAlert(error: Error) {
        let alert = UIAlertController(
            title: "Connection Error",
            message: "Failed to load Rising Lion game. Please check your internet connection.\n\nError: \(error.localizedDescription)",
            preferredStyle: .alert
        )
        
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { _ in
            self.loadGame()
        })
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        
        present(alert, animated: true)
    }
    
    // MARK: - Orientation Support
    
    override var supportedInterfaceOrientations: UIInterfaceOrientationMask {
        return .allButUpsideDown
    }
    
    override var shouldAutorotate: Bool {
        return true
    }
    
    override var prefersStatusBarHidden: Bool {
        return true
    }
}
