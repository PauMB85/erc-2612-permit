# Bye Bye Approve: optimiza tus dApps con Permit

En Web3 cada transaccion cuenta, tanto a nivel de gas, como fricción de cara al usuario.
Si ya has usado algún protocolo cada vez que depositas tus token sabes que te toca hacer dos transacciones:

1 Approve. Das permisos al protocolo para que puede gestionar X cantidad de tokens.
2 Transfer. Transfiriendo los tokens al protocolo.

Hoy te presenta una nueva extesión del ERC-20 que evita tener que hacer estas dos transacciones

¿Qué es ERC-2612?
Es una extensión del estándar ERC-20 que introduce la función permit, permitiendo que un usuario firme off-chain una autorización para mover sus tokens, y que esta autorización pueda ser usada on-chain por otra "persona" sin necesidad de pagar una transacción "approve" y esto es posible gracias a las firmas EIP-712 y el uso de ecrecover

¿Por que usarlo?
- Mejora la experiencia del usuario. No requiere hacer dos transacciones, solo una
- Reduce el coste en gas. El usuario no necesita pagar la transaccion "approve"
- Facilita la integracion Dapps. Ideal en protocoloes que gestionan los tokens de los usuarios.

A continuación te dejo el link a mi repo para que lo puedas probar por ti mismo, comprobar los beneficios y como poderlo intgrar a tu token ERC-20.

¿Ya conocias Permit la extensión del ERC-20?