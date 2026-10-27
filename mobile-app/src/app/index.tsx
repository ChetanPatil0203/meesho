import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  BackHandler,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

// Calculate the default IP address where Vite server (port 5173) is running
function detectServerUrl(): string {
  try {
    const hostUri = Constants.expoConfig?.hostUri || '';
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
        return `http://${ip}:5173`;
      }
    }
  } catch (e) {
    // fallback
  }
  // Default to machine's primary LAN IP
  return 'http://10.2.0.153:5173';
}

export default function AppScreen() {
  const [currentUrl, setCurrentUrl] = useState<string>(detectServerUrl());
  const [inputUrl, setInputUrl] = useState<string>(currentUrl);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [canGoBack, setCanGoBack] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const webViewRef = useRef<WebView>(null);

  // Handle hardware back button on Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      const onBackPress = () => {
        if (canGoBack && webViewRef.current) {
          webViewRef.current.goBack();
          return true; // prevent default app exit
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }
  }, [canGoBack]);

  const handleRefresh = () => {
    setHasError(false);
    setIsLoading(true);
    webViewRef.current?.reload();
  };

  const handleApplyUrl = (newUrl: string) => {
    let formatted = newUrl.trim();
    if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
      formatted = 'http://' + formatted;
    }
    setCurrentUrl(formatted);
    setInputUrl(formatted);
    setHasError(false);
    setIsLoading(true);
    setIsSettingsOpen(false);
  };

  // If running directly on web browser (localhost:8081)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webCard}>
          <Text style={styles.webTitle}>🛍️ Shopio App</Text>
          <Text style={styles.webSubtitle}>
            Web Application is running at port 5173.
          </Text>
          <TouchableOpacity
            style={styles.webButton}
            onPress={() => {
              if (typeof window !== 'undefined') {
                window.location.href = 'http://localhost:5173';
              }
            }}
          >
            <Text style={styles.webButtonText}>Open Shopio Website (http://localhost:5173) ➔</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Main WebView Container */}
      <View style={styles.webviewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: currentUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
          mixedContentMode="always"
          originWhitelist={['*']}
          allowsBackForwardNavigationGestures={true}
          onLoadStart={() => {
            setIsLoading(true);
            setHasError(false);
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            setIsLoading(false);
            setHasError(true);
            setErrorMessage(nativeEvent.description || 'Connection failed');
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            if (nativeEvent.statusCode >= 400) {
              setErrorMessage(`Server error HTTP ${nativeEvent.statusCode}`);
            }
          }}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
          }}
        />

        {/* Loading Overlay */}
        {isLoading && !hasError && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#9c1b5a" />
            <Text style={styles.loadingText}>Shopio ॲप लोड होत आहे...</Text>
            <Text style={styles.urlHint}>{currentUrl}</Text>
          </View>
        )}

        {/* Error / Offline Screen */}
        {hasError && (
          <View style={styles.errorOverlay}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Vite Server शी जोडता आले नाही</Text>
            <Text style={styles.errorDesc}>
              मोबाईल ॲपला Shopio Web App शी जोडता आले नाही.{'\n'}
              कृपया कॉम्प्युटरच्या रूट फोल्डरमध्ये{'\n'}
              <Text style={styles.codeText}>npm run dev</Text> चालू असल्याची खात्री करा.
            </Text>
            <Text style={styles.errorDetail}>Target: {currentUrl}</Text>

            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>🔄 पुन्हा प्रयत्न करा (Retry)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.changeUrlButton}
              onPress={() => setIsSettingsOpen(true)}
            >
              <Text style={styles.changeUrlText}>⚙️ Server IP बदला</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* URL Settings Modal */}
      <Modal
        visible={isSettingsOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Shopio Server URL Settings</Text>
            <Text style={styles.modalSub}>
              तुमच्या कॉम्प्युटरवर Vite ज्या IP वर चालत आहे तो URL टाका:
            </Text>

            <TextInput
              style={styles.input}
              value={inputUrl}
              onChangeText={setInputUrl}
              placeholder="http://10.2.0.48:5173"
              placeholderTextColor="#999"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.presetLabel}>Quick Presets:</Text>
            <View style={styles.presetRow}>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => handleApplyUrl('http://10.2.0.153:5173')}
              >
                <Text style={styles.presetBtnText}>Wi-Fi / LAN (10.2.0.153)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.presetBtn}
                onPress={() => handleApplyUrl('http://192.168.137.1:5173')}
              >
                <Text style={styles.presetBtnText}>Hotspot (192.168.137.1)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setIsSettingsOpen(false)}
              >
                <Text style={styles.cancelBtnText}>रद्द करा (Cancel)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => handleApplyUrl(inputUrl)}
              >
                <Text style={styles.saveBtnText}>लागू करा (Connect)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#9c1b5a',
    fontSize: 16,
    fontWeight: '700',
  },
  urlHint: {
    color: '#666666',
    fontSize: 12,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  errorDesc: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: '700',
    color: '#9c1b5a',
    backgroundColor: '#f1f5f9',
  },
  errorDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#9c1b5a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  changeUrlButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeUrlText: {
    color: '#9c1b5a',
    fontWeight: '600',
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#0f172a',
  },
  presetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  presetBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: '#9c1b5a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  webCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    maxWidth: 480,
    width: '100%',
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  webTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#9c1b5a',
  },
  webSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
  },
  webButton: {
    backgroundColor: '#9c1b5a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  webButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
