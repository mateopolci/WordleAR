import React, { ReactNode, isValidElement, cloneElement } from "react";
import {
    TouchableOpacity,
    Text,
    TouchableOpacityProps,
    useColorScheme,
    StyleSheet,
    View,
} from "react-native";
import Colors from "@/constants/Colors";

interface ThemedButtonProps extends TouchableOpacityProps {
    title?: string;
    children?: ReactNode;
}

const ThemedButton: React.FC<ThemedButtonProps> = ({
    style,
    title,
    children,
    ...rest
}) => {
    const colorScheme = useColorScheme();

    const backgroundColor = Colors[colorScheme ?? "light"].buttonBg;
    const textColor = Colors[colorScheme ?? "light"].buttonText;

    // Función para clonar y modificar los hijos (iconos)
    const modifiedChildren = React.Children.map(children, (child) => {
        if (isValidElement(child)) {
            return cloneElement(child, {
                ...child.props,
                color: textColor,
                style: [
                    child.props.style,
                    { color: textColor }
                ]
            });
        }
        return child;
    });

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            {...rest}
        >
            <View style={styles.contentContainer}>
                {modifiedChildren}
                {title && (
                    <Text style={[styles.buttonText, { color: textColor }]}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 8,
    },
});

export default ThemedButton;