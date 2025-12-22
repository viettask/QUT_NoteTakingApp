import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import licenses from '../client-licenses.json';
import { useFontSize } from '../context/fontSizeContext'; // ADD THIS IMPORT

export default function AboutScreen() {
    // State to store the processed license data and the loading state
    const [licenseData, setLicenseData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Access the current font size from the context
    const { fontSize } = useFontSize();

    // useEffect hook to process the licenses data when the component mounts
    useEffect(() => {
        processLicenses();
    }, []);

    // Function to process the licenses data from the JSON
    const processLicenses = () => {
        try {
            // Convert object to array and extract unique licenses
            const licensesArray = Object.entries(licenses).map(([name, info]) => ({
                name: name,
                license: info.licenses || 'Unknown', // Default to 'Unknown' if no license info exists
            }));

            // Group packages by their license type
            const grouped = {};
            licensesArray.forEach(item => {
                if (!grouped[item.license]) {
                    grouped[item.license] = []; // Create an array for each license type
                }
                grouped[item.license].push(item.name);
            });

            // Convert the grouped object to an array and sort by license type
            const processed = Object.entries(grouped)
                .map(([license, packages]) => ({
                    license,
                    count: packages.length,
                    packages: packages.sort(), // Sort the packages alphabetically
                }))
                .sort((a, b) => b.count - a.count); // Sort by package count in descending order

            // Set the processed data into the state
            setLicenseData(processed);
        } catch (error) {
            console.error('Error processing licenses:', error);
        } finally {
            setLoading(false); // Set loading to false once processing is complete
        }
    };

    // If data is still loading, show a loading spinner
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        // Scrollable view to allow content to be scrollable if it exceeds the screen height
        <ScrollView style={styles.container}>
            {/* Title of the About screen */}
            <Text style={styles.title}>Note Taking App</Text>

            {/* Description of the app with dynamic font size */}
            <Text style={[styles.description, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                This application allows you to efficiently create, manage, and access your personal notes.
            </Text>

            {/* Features section */}
            <Text style={[styles.subTitle, fontSize === 'big' ? styles.bigSubTitle : styles.smallSubTitle]}>Features:</Text>
            <Text style={[styles.feature, fontSize === 'big' ? styles.bigText : styles.smallText]}>• Create and edit your notes with ease.</Text>
            <Text style={[styles.feature, fontSize === 'big' ? styles.bigText : styles.smallText]}>• Organize notes by user-specific categories.</Text>
            <Text style={[styles.feature, fontSize === 'big' ? styles.bigText : styles.smallText]}>• Secure your notes with user authentication.</Text>

            {/* Open source licenses section */}
            <Text style={[styles.subTitle, fontSize === 'big' ? styles.bigSubTitle : styles.smallSubTitle]}>Open Source Licenses:</Text>
            <Text style={[styles.licenseInfo, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                This app uses {Object.keys(licenses).length} open source packages
            </Text>

            {/* Mapping through license data to display each license and its packages */}
            {licenseData.map((item, index) => (
                <View key={index} style={styles.licenseGroup}>
                    {/* Displaying the license header with the package count */}
                    <Text style={[styles.licenseHeader, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                        {item.license} ({item.count} packages)
                    </Text>
                    {/* Displaying up to 10 packages under the license */}
                    {item.packages.slice(0, 10).map((pkg, pkgIndex) => (
                        <Text key={pkgIndex} style={[styles.packageName, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                            • {pkg}
                        </Text>
                    ))}
                    {/* If there are more than 10 packages, show an ellipsis */}
                    {item.count > 10 && (
                        <Text style={styles.morePackages}>
                            ... and {item.count - 10} more
                        </Text>
                    )}
                </View>
            ))}

            {/* Footer text with the source of the licenses */}
            <Text style={[styles.footer, fontSize === 'big' ? styles.bigText : styles.smallText]}>
                Licenses generated by npm-license-crawler. @ 2025 Note Taking App.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Styles for the overall container of the screen
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    // Style for centering the loading spinner
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Style for the main title
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5,
        textAlign: 'center',
        color: '#007AFF',
    },
    // Style for the version text
    version: {
        fontSize: 14,
        marginBottom: 15,
        textAlign: 'center',
        color: '#666',
    },
    // Style for the description text
    description: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#555',
        lineHeight: 24,
    },
    // Styles for subtitle
    subTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#007AFF',
    },
    smallSubTitle: {
        fontSize: 20,
    },
    bigSubTitle: {
        fontSize: 22,
    }
    ,
    // Style for each feature text
    feature: {
        fontSize: 16,
        marginBottom: 8,
        color: '#555',
        lineHeight: 22,
    },
    // Style for license information text
    licenseInfo: {
        fontSize: 16,
        marginBottom: 15,
        color: '#555',
    },
    // Style for each license group container
    licenseGroup: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 6,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    // Style for the license header text
    licenseHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#007AFF',
    },
    // Style for each package name text
    packageName: {
        fontSize: 16,
        marginBottom: 4,
        marginLeft: 10,
        color: '#555',
    },
    // Style for the "more packages" text
    morePackages: {
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10,
        color: '#999',
        fontStyle: 'italic',
    },
    // Style for the footer text
    footer: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
        textAlign: 'center',
        color: '#999',
    },
    smallText: {
        fontSize: 16, // Default small font size
    },
    bigText: {
        fontSize: 20, // Larger font size
    },
});

