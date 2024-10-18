import React from "react";
import {
    TouchableOpacity,
    Text,
    TouchableOpacityProps,
    useColorScheme,
} from "react-native";
import Colors from "@/constants/Colors";

const ThemedButton = ({
    style,
    title,
    ...rest
}: TouchableOpacityProps & { title: string }) => {
    const colorScheme = useColorScheme();

    const backgroundColor = Colors[colorScheme ?? "light"].buttonBg;
    const textColor = Colors[colorScheme ?? "light"].buttonText;

    return (
        <TouchableOpacity style={[{ backgroundColor }, style]} {...rest}>
            <Text style={{ color: textColor }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default ThemedButton;
